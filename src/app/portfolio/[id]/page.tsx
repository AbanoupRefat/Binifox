import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import { getProjectById, getProjects } from "@/lib/queries";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Project Details - Binifox",
  description: "View detailed information about our project.",
};

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      id: project.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let project;

  try {
    project = await getProjectById(id);
  } catch (error) {
    console.error("Error fetching project:", error);
  }

  if (!project) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Project not found" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Project Details</h1>
              <p className="text-white/70 text-lg">
                Explore the details of this project
              </p>
            </div>
          </div>
        </section>

        {/* Project Details Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Project Image */}
              {project.image && (
                <div className="mb-12 rounded-lg overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Project Title */}
              <h2 className="text-4xl font-teko font-bold text-dark mb-4">
                {project.title}
              </h2>

              {/* Project Meta */}
              <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="text-lg font-semibold text-dark">{project.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="text-lg font-semibold text-dark">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Project Description */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed">
                  This is a detailed project page. You can add more content here such as:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>Project overview and objectives</li>
                  <li>Technologies and tools used</li>
                  <li>Challenges and solutions</li>
                  <li>Results and outcomes</li>
                  <li>Client testimonials</li>
                </ul>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <Link
                  href="/portfolio"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Portfolio
                </Link>
                <div className="flex gap-2">
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-dark" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronRight className="w-5 h-5 text-dark" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-3xl font-teko font-bold text-dark mb-12 text-center">
              More Projects
            </h3>
            <Portfolio />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
