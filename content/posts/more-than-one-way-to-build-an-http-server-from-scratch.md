+++
author = "Harish Krishnakumar"
title = "More than one way to build an HTTP server from scratch"
date = "2025-03-08"
description = "In this install of Tools, Terminal and TCP we build a Web server from scratch, HTTP request parsing, routing using radix trees and more"
+++

I always wondered how a web framework like `Echo` in Go or `Express` in Node works so I decided to write one myself. I wondered how difficult is it akshually, and turns out it is actually difficult to build a framework with a full feature set but for learning purposes we are going to make a simple web server from scratch and dissect it's inner workings. Shoutout to [CodeCrafters](https://codecrafters.io/) for being such a cool starting point. Highly Recommended!


## Early Start
So I started off with the CodeCrafters Challenge - `Build your own HTTP server`. This was a really great starting point form a mental model of how a HTTP server actually works. I am going to break this down the way I understood it. So we know that HTTP is an application level protocol which works on top of TCP. If you did not know, now you know. So, a simple way to think about HTTP is as a formatted message that, when read over TCP, provides information about what the client needs. So think of it as a stream of bytes sent over TCP and you parse these bytes based on certain rules to extract information like the request type, request body so on and so forth. This idea is especially powerful when you want to handroll your own network protocol like what Redis does with RESP which will be a different blog in itself. 

## Web Frameworks
Whenever thinking of a framework a good idea is to think of them as a collection of different functionalities provided out of the box. So one can in idea assemble a framework by bringing these functionalities yourself or through tools already available. So for example If I were to think of making a web framework, I would look at a tool which a interface over network primitives like sockets, to read over TCP, maybe a HTTP parser to extract the request information. I would think of routing as pattern matching over the defined endpoints and attaching a HTTP handler to each one. Lastly I would write my code in such a way so that I can call it **Blazingly Fast!** in the documentation. So a web framework does these functionalities I glanced over above. So can I make one?

## Implementation - Building a web framework one way
Absolutely! Let's break down the functionalities we discussed and implement them one by one. I did the initial implementation in Go cause why not but you can choose any language. Except haskell, we aren't writing one on whitepaper. I am just joking! 

{{< figure src="/img/http-blog.jpg" alt="Accurate representation of myself" position="center" width="100%" caption="Accurate representation of me, writing that joke" captionPosition="center" >}}

### 1. Listenng over TCP
Without boring you upfront, we will start off with the most common approach. **Blocking IO**. We listen to `TCP` connections on a certain port using the `listen` method, provided by most networking packages in the standard library of most languages. Once `listen` is successful we indefinetly call the `accept` method to accept client connections and process them. In a few low-level languages like the Holy C, you would create a `socket`, bind the port you want to listen to using the `bind` method and then call `listen` on it. But I hope you are not writing C, if you are, more power to you (FYI I am writing this in C as well 🥲). This is what the code snippet looks like from my toy HTTP framework (Disel)[https://github.com/harish876/disel]

```go
func (d *Disel) ServeHTTP(host string, port int) error {
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", host, port))
	if err != nil {
		fmt.Println("Failed to bind to port")
		os.Exit(1)
	}
	d.Log.Infof("Server Stated on port... %d", port)
	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting connection: ", err.Error())
			break
		}
		defer conn.Close() //close the connection
        go d.handleConnection(conn)
		
	}
	os.Exit(1)
	return nil
}
```
This piece of code creates a go thread for each connection. This is often referred to as **THREAD PER CONNECTION** and we will discuss its implications.

### 2. Parsing the stream of bytes
So a standard practice is to use a byte buffer of a size 1KiB (1024 bytes) to read from the open connection (socket if we are being technical). So once we have read the request into our buffer, we can now parse it or deserialize it.
Here is a code snippet from `disel`

```go
func (d *Disel) handleConnection(conn net.Conn) {
	for {
		buf := make([]byte, 1024)
		recievedBytes, err := conn.Read(buf)
		if err == io.EOF || err != nil {
			d.Log.Debug(err)
			break
		}
		request := buf[:recievedBytes]
		rawRequest := string(request)
		parsedRequest := DeserializeRequest(rawRequest)
		d.Log.Debug("Raw Request is", rawRequest)
		ctx := &Context{
			Request: parsedRequest,
			Ctx:     context.Background(),
		}
		err = d.execHandler(ctx)
		if err != nil {
			d.Log.Error(err)
		}
		sentBytes, err := conn.Write([]byte(ctx.Response.body))
		if err != nil {
			d.Log.Debug("Error writing response: ", err.Error())
		}
		d.Log.Debug("Sent Bytes to Client: ", sentBytes)
	}
}
```
This actually is the sucky part if I am being honest, since you go over the protocol specification fight the registered nurses (`\r\n`) and convert this byte buffer into something meaningful. I will just give you the struct we are going to use for each request.

```go
type HttpRequest struct {
	Method         string
	Path           string
	PathParams     []string
	Host           string
	UserAgent      string
	Version        string
	Body           *strings.Reader
	ContentType    string
	ContentLength  int
	AcceptEncoding string
}
```
Now that we have deserialized the request, its time to respond to the client as well, since we are nice people. We serialize the request based on the same rules we used to read and use the `write` method to write the response back. A very important thing to make sure is that we have the `Content-Length` header in the response so that we tell the client how long the response is. Here is the code snippet I use for Serializing the response.

```go
func Serialize(status int, content string, contentType string) string {

	var text string
	if status == 200 {
		text = SUCCESS_TEXT
	} else if status == 404 {
		text = NOT_FOUND_TEXT
	}

	firstLine := fmt.Sprintf("%s %d %s", HTTP_VERSION, status, text)
	if len(content) == 0 {
		return firstLine + "\r\n" + "Content-length: 0" + "\r\n\r\n"
	}
	secondLine := fmt.Sprintf("Content-Type: %s", contentType)
	thirdLine := fmt.Sprintf("Content-Length: %d", len(content))
	return firstLine + "\r\n" + secondLine + "\r\n" + thirdLine + "\r\n\r\n" + content
}
```

### 3. Routing
Now that we have mechanisms to understand the HTTP language how do we know that when I hit a endpoint named `/echo` calls a certain logic. This is where routing comes into play. So routing is as simple as a mapping betwen a string and a handler function. So we could have a hash map with key as a string and the value as a pointer to the handler function. Well what if the number of endpoints keep growing, then the hash map grows and more bloated our blazingly fast HTTP framework looks.

This is where a nifty trie like data structure, Radix Tree comes into play. `Echo` uses a Radix Tree and it calls itself blazingly fast, and I am not going to lie, I love `Echo` so lets use a Radix Tree for our purposes. A radix tree is like a compressed trie, and lets us search through prefixes efficiently because most of our API routes share a common prefix. Sweet!

I will abridge this blog and not include the Radix Tree implementation but here is how I use the data structure for routing

```go
func (d *Disel) execHandler(ctx *Context) error {
	var handler DiselHandlerFunc
	switch ctx.Request.Method {

	case "GET":
		node, found := d.GetHandlers.Search(ctx.Request.Path)
		d.Log.Debug("Incoming GET Route Path is", ctx.Request.Path)
		if !found {
			handler = nil
		} else {
			handler = *node.Value.(*DiselHandlerFunc)
			d.Log.Debug("GET Handler is", handler)
		}

	case "POST":
            //... 

	case "PUT", "PATCH":
            //...

	case "DELETE":
            //...
	default:
		handler = nil
	}

	if handler == nil {
		ctx.Status(404).Send(fmt.Sprintf("Route Not found for Incoming Path %s", ctx.Request.Path))
		return nil
	}
	_, cancel := context.WithTimeout(ctx.Ctx, time.Second*10)
	defer cancel()
	if err := handler(ctx); err != nil {
		ctx.Status(http.StatusInternalServerError).Send("Not Found")
		return err
	}
	return nil
}
```

### Implementation -  So what are the othe way?
Remember we used the `accept` method on a infinite loop and spawn a goroutine for each incoming connection. The `accept` method is blocking in nature i.e synchronous. If there are too many connections then you spawn too many goroutines or (green threads)[https://en.wikipedia.org/wiki/Green_thread]. Your system can only spawn so many threads. Ok, let's say you offset the thread problem by a thread pool.The problem then becomes, when you accept a client connection and there is no activity on that connection. It just sits idle, an idle connection. Hmmm, NodeJS is single threaded, Redis is single threaded, how do they handle so many connections on a single thread? Welcome my friend, Asynchronous IO. 

### Scary system calls are fun (if not `fsync`) - `epoll`
Imagine you’re on the streets of New York, and you suddenly crave a chopped cheese. You walk into a bodega, and while there’s still only one entrance, the inside is set up with multiple counters where different staff members are taking orders. Catch, a worker always needs to present at a counter to take orders.

Instead of having workers constantly check for new activity, **motion sensors** are installed at each counter. These sensors detect when a customer is waiting and notify an available worker to that counter.

This is more efficient because:

- The workers are only directed to a counter when there's an actual customer (i.e., an event to handle).
- **`epoll`** reduces unnecessary polling by only waking up workers when there’s real work to do.

This is a gross oversimplification and I would advise to not take deep technical explainations from me. Even I dont completely understand epoll if I were being honest. Please give this a read [epoll](https://copyconstruct.medium.com/the-method-to-epolls-madness-d9d2d6378642)

Here is a totall sane piece of C code I am using to do epoll.
```C
void use_epoll(int server_fd) {
  int epoll_fd = epoll_create1(0);
  if (epoll_fd == -1) {
    perror("epoll_create1");
    exit(EXIT_FAILURE);
  }

  struct epoll_event event;
  event.events = EPOLLIN;
  event.data.fd = server_fd;

  // Add the server_fd to the epoll instance's interest list
  if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, server_fd, &event) == -1) {
    perror("epoll_ctl");
    exit(EXIT_FAILURE);
  }

  struct epoll_event events[MAX_EVENTS];
  struct sockaddr_in client_addr;
  socklen_t client_addr_len;

  while (1) {
    int n = epoll_wait(epoll_fd, events, MAX_EVENTS, -1);
    if (n == -1) {
      perror("epoll_wait");
      break;
    }
    for (int i = 0; i < n; i++) {
      if (events[i].data.fd == server_fd) {
        client_addr_len = sizeof(client_addr);
        int conn = accept(server_fd, (struct sockaddr *)&client_addr,
                          &client_addr_len);

        if (conn == -1) {
          if ((errno == EAGAIN) || (errno == EWOULDBLOCK)) {
            break;
          } else {
            perror("accept");
            break;
          }
        }
        set_non_blocking(conn);
        event.events = EPOLLIN | EPOLLET;
        event.data.fd = conn;
        //ADDS CONNECTION_FD to INTREST SET
        if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, conn, &event) == -1) {
          perror("epoll_ctl");
          close(conn);
          continue;
        }
      } else {
        //HANDLES REQUEST
        handle_connection(events[i].data.fd);
        close(events[i].data.fd);
      }
    }
  }
  close(epoll_fd);
}
```

### Whats Next?
Well, my next goal is to benchmark Web Servers written in C and Rust (yeah!). Sorry `Go`, you are garbage collected. The goal would be to use the understanding from building a simple web server in Go to actually understanding if there are any language specific differences we get from the same implementation. So be on the lookout for fun flamegraphs, benchmarks and till then see you in the next install of Tools, Terminal and TCP!

Github Link for `Disel` - [Github](https://github.com/harish876/Disel)