+++
author = "Harish Krishnakumar"
title = "A tale of typos✍️, Tree Sitter🌳, and finally an LSP (Part-1)"
date = "2024-06-07"
description = "In this install of Tools, Terminal and TCP, we build a unified ETL pipeline, explore config-driven code, dive into Tree-Sitter for efficient parsing, and develop a custom LSP alongside a code-gen CLI."
+++

A few months back I was asked to write an ETL (Extract, Transform, Load) framework at work, where I could run all my ETL jobs uniformly using a single codebase. I wanted to write some Python and this was a great opportunity to do it. Here is a tale of how a brief expedition of Python, and a quest to write config-driven code coupled with numerous typos, led me to tree-sitter, building a code-gen CLI, and a custom LSP.

### Early Steps

So when the opportunity presented itself, I was enthused, I had a twinkle in my eye to write something from scratch because my previous attempts to do the same were an abject failure but that's neither here nor there. One thing that did catch my eye was a design pattern my manager told me to implement, "Chain of Responsibility". I was intrigued and wrote a small little version of my framework overnight to which I received a "lol" on my PR. Needless to say, it wasn't a good PR, so I decided to work a little harder to get it right.

After a week of "Factory Pattern", "Builder Pattern" and "Singleton Classes", I raised another PR to which I received relatively good feedback from my manager (I think). I was happy and ready to call it a day but he told me to make the code config-driven. The point was that you write the actual driver code or your application logic and manage all the transformations, fallback values, and configurations from a single source file. Initially, this idea did not amuse me but when he casually slipped in the fact that he had done it, my competitive side wanted to do it at any cost and impress him (akshually the idea was a JDSL-like config store but Tom is a genius, not me).

### The Config-Driven Struggle

So I started with the "ini" file format, which is used by another cool tool "pgLoader" (a story for another day). I wanted to use "JSON" (correct pronunciation) like a regular human being but the thought of trailing commas and the inability to use comments were factors in my decision to not use it. I could have used "YAML" but I am happy I chose "ini" (a cool followup to this point later in this story).

The idea of parsing any configuration file is that you convert these chunks of structured key-value pairs into a data structure that can then be globally accessed. Neat proposition, but man is it emotionally bruising to get it right. How does your parsing library coerce the config types without you doing it? How do you parse nested configurations? How do you provide default values? And most importantly, "HOW DO I FIND OUT IF I MADE A SPELLING MISTAKE? IS IT MY CODE, IS IT MY CONFIG?"

Another issue with config-driven code is, that you end up writing factory classes to map the configs to classes or files and these just end up being a never-ending list of the same configs that you need to copy over to your factory. Not an interesting prospect.

### Grug Love Tool

Grug love tool. Tool and control passion separate grug from dinosaurs! Tool allows grug brain to create code that would not be possible otherwise by doing the thinking for grug. Code completion in IDE allows grug not to have remembered all API, very important!

Me being grug developer, so grug decide to build developer tools so grug no make mistakes.

{{< figure src="/img/grug_developer.png" alt="Accurate representation of myself" position="center" caption="Accurate representation of myself" captionPosition="center" >}}

### Tackling Code Gen and Typos

Let's tackle the problems of the tooling (Code gen and typos). I was playing around with some CLI tooling to do some code gen so that you and I, the 10x developer, do not need to write boilerplate code. Suffice it to say this took me more time than it would have taken me to write 1000 lines of config but that's cliche, ain't it? Let's get to some code shall we?

### Configuration File Example

This is what my config file looks like:

```ini
[job_options] # this is a section
jobs = demo #this is an option

[demo]
steps = extract_json,transform_json,load_json

[load_json]
type = loader
directory = "output"
filename = /output/demo.json

[transform_json]
type = transform
columns = "foo,bar,baz"
delimiter = ","

[extract_json]
type = extractor
directory = "input"
filename = "demo.csv"
```

This is what my folder structure looks like:

```bash
config
 - settings.local.ini
 - settings.dev.ini

factory
 - extractor_factory.py
 - loader_factory.py

jobs
 - extractors
    - extract_json_job.py
 - loaders
    - load_json_job.py
```

This is what my factory code looks like:

```python
from factory.factory_interface import Factory
from jobs.extractors.extract_json_job import ExtractJsonJob

class ExtractorFactory(Factory):
 def __init__(self):
  super().__init__()

 def create(self, mode, **kwargs):
  merged_config = self.get_config(mode)

  #Autogenerated File Section. Do not Edit this file

  match mode:
   case "extract_json":
    return ExtractJsonJob(config=merged_config)
   case _:
    raise ValueError("Invalid extract type")
```

let's say, I want to add a new extractor option, let's say "extract_mssql". I would have to go to my config file add a new option, then go to my factory class and add a new case statement. Not only that, but I would also need to add and update my file structure, the place where the actual code for this would be written, i.e. in the jobs/extractors folder. This is a tedious task, so I wrote a small little CLI ( akshually was very long ) which would do the above steps for you.

The command to do this would be:

```bash
forge create_step --type extractor --name extract_mssql
```

This would do the necessary boilerplate setup. (Demo Video Link at the end of the article). So one might say "Well the file naming would follow some naming convention, what if I don't want to adhere to it and just name my file the way I want". The CLI also takes this fact into account. You see, a dumb CLI tool would look at all the files, pick the name of the step from the file URI, store it in a local SQLite database, and bam, write it to the factory right? Wrong!. This is when "tree-sitter" popped into my head.

If you have been following along great, if not then let me expound upon the last point using an example. Imagine this is my factory code from earlier.

```python
from factory.factory_interface import Factory
from jobs.extractors.extract_json_job import ExtractJsonJob # Actual Path

class ExtractorFactory(Factory):
 def __init__(self):
  super().__init__()

 def create(self, mode, **kwargs):
  merged_config = self.get_config(mode)

  #Autogenerated File Section. Do not Edit this file

  match mode:
   case "extract_json":
    return ExtractJsonJob(config=merged_config) # Actual Option
   case _:
    raise ValueError("Invalid extract type")
```

Now when the CLI generates a new file, it needs to know that this maps to a file. If a user decides to change this mapping then he/she would manually rename these files and update the factory accordingly. So in practice during my code gen process, I need to scan the state of the factory file, and then make a decision to **partially update** it.

So the question arises, how do we know where to place the option, how would we know which line to place it at, do we read the file line by line, do we use regex to match the case statement, how can we incrementally update the file at multiple places? The answer is tree-sitter.

Tree Sitter is a parser generator that generates an AST or an Abstract Syntax Tree of your program.This is an abridged version of AST of my factory code:

```Auto
module [0, 0] - [17, 0]
  import_from_statement [0, 0] - [0, 45]
    module_name: dotted_name [0, 5] - [0, 30]
      identifier [0, 5] - [0, 12]
      identifier [0, 13] - [0, 30]
    name: dotted_name [0, 38] - [0, 45]
      identifier [0, 38] - [0, 45]  

 --- MARKER - 1 NEW IMPORT STATEMENT HERE ----

  comment [1, 60] - [1, 73]
  class_definition [3, 0] - [16, 44]
    name: identifier [3, 6] - [3, 22]
    superclasses: argument_list [3, 22] - [3, 31]
      identifier [3, 23] - [3, 30]
    body: ...
        match_statement [10, 2] - [14, 44]
            subject: identifier [10, 8] - [10, 12]
            body: block [10, 13] - [14, 44]
              alternative: case_clause [11, 3] - [12, 63]
                case_pattern [11, 8] - [11, 22]
                  string [11, 8] - [11, 22]
                    string_start [11, 8] - [11, 9]
                    string_content [11, 9] - [11, 21]
                    string_end [11, 21] - [11, 22]
                consequence: block [12, 4] - [12, 63]
                  return_statement [12, 4] - [12, 47]
                    call [12, 11] - [12, 47]
                      function: identifier [12, 11] - [12, 25]
                      arguments: argument_list [12, 25] - [12, 47]
                        keyword_argument [12, 26] - [12, 46]
                          name: identifier [12, 26] - [12, 32]
                          value: identifier [12, 33] - [12, 46]
                  comment [12, 48] - [12, 63]

              --- MARKER -2 INSERT THE NEW STEP/OPTION HERE ----

              alternative: case_clause [13, 3] - [14, 44]
                case_pattern [13, 8] - [13, 9]
                consequence: block [14, 4] - [14, 44]
                  raise_statement [14, 4] - [14, 44]
                    call [14, 10] - [14, 44]
                      function: identifier [14, 10] - [14, 20]
                      arguments: argument_list [14, 20] - [14, 44]
                        string [14, 21] - [14, 43]
                          string_start [14, 21] - [14, 22]
                          string_content [14, 22] - [14, 42]
                          string_end [14, 42] - [14, 43]
```

We don't need to go into specifics of what this tree means but, you can think of it as generating a structure that gives you context on the lexical tokens present in your program. It then provides you an interface to pluck out these tokens using a query language and voila, you have your coordinates where you can incrementally update your file (as seen from the markers placed in the example AST snippet). Play around with the tree-sitter playground here.

This way, I can preserve the changes the user has made to their factory, whilst still fulfilling the code generation aspect of it. So this solves the boilerplate problem. But what about the next issue at hand, the typos? We will cover that in part 2 of this article. And yes, I reveal why the "ini" file was a nice choice in it as well.

Hope you found this article engaging and exciting. If you liked it please do give some clappies, star the GitHub repo be a friend, and tell a friend, until then see you in the next installation of "Tools, Terminal and TCP".

Video Demo: [Link](https://harish876.github.io/forge/cli_demo.mp4)
<br/>
GitHub Link: [Forge ETL](https://github.com/harish876/forge/)