import Header from "@/components/Header";
import Footer from "@/components/Footer";
import News from "@/components/News";
import { getArticleById, getArticles } from "@/lib/queries";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, User, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Article - Binifox",
  description: "Read our latest article and insights.",
};

export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((article) => ({
      id: article.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let article;

  try {
    article = await getArticleById(params.id);
  } catch (error) {
    console.error("Error fetching article:", error);
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Article not found" />
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
              <h1 className="heading-lg text-white mb-4">Blog Article</h1>
              <p className="text-white/70 text-lg">
                Read our latest insights and articles
              </p>
            </div>
          </div>
        </section>

        {/* Article Details Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Article Image */}
              {article.image && (
                <div className="mb-12 rounded-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Article Title */}
              <h2 className="text-4xl font-teko font-bold text-dark mb-6">
                {article.title}
              </h2>

              {/* Article Meta */}
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5 text-primary" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span>{article.comments} Comments</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed">
                  This is a detailed article page. You can add more content here such as:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>Article introduction and overview</li>
                  <li>Main content sections</li>
                  <li>Key takeaways and insights</li>
                  <li>Call to action</li>
                  <li>Related resources</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  The article content will be displayed here. You can format it with headings, paragraphs,
                  lists, and other HTML elements as needed.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <Link
                  href="/news"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to News
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

        {/* Related Articles */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-3xl font-teko font-bold text-dark mb-12 text-center">
              More Articles
            </h3>
            <News />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
