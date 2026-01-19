import { ProjectsContent } from "@/components/projects-content";
import { getPageBySlug } from "@/lib/pages";

export default function ProjectsPage() {
    const page = getPageBySlug("projects");

    return (
        <div className="h-full w-full bg-background text-white">
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-funnel font-light text-white mb-4">
                        Projects
                    </h1>
                    <p className="text-grey font-mono text-lg">
                        My work and side projects
                    </p>
                </div>

                <div className="prose prose-invert prose-grey max-w-none">
                    {page ? (
                        <ProjectsContent body={page.body} />
                    ) : (
                        <div className="text-grey font-sans text-base">
                            Content not found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
