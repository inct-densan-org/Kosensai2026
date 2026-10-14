import ArticleList from "@/components/common/ArticleList";
import Footer from "@/components/common/Footer";
import PageBackground from "@/components/common/PageBackground";
import { PAGE_BACKGROUND } from "@/components/common/pageLayout";
import { shipporiMincho } from "@/components/common/fonts";
import { getBlogArticles } from "@/lib/blog";

export default async function BlogPage() {
  const articles = await getBlogArticles();
  return (
    <div className="relative isolate min-h-screen w-full" style={{ backgroundColor: PAGE_BACKGROUND }}>
      <PageBackground />
      <main className="min-h-screen px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-3xl">
          <header className="mb-8 border-b border-black/20 pb-8 sm:mb-10 sm:pb-9">
            <h1
              className={`${shipporiMincho.className} !text-4xl !font-bold !leading-none tracking-[0.08em] sm:!text-6xl`}
            >
              ブログ
            </h1>
          </header>
          <ArticleList
            articles={articles}
            contentType="blog-articles"
            hrefPrefix="/blog"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
