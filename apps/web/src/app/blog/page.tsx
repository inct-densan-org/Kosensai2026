import BlogTabs from "@/components/blog/BlogTabs";
import Footer from "@/components/common/Footer";
import PageBackground from "@/components/common/PageBackground";
import { PAGE_BACKGROUND } from "@/components/common/pageLayout";
import { shipporiMincho } from "@/components/common/fonts";
import { getBlogArticles } from "@/lib/blog";
import { getPublishedShopAnnouncements } from "@/lib/shops";

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>
}) {
  const params = await searchParams;
  const initialTab = params?.tab === "announcements" ? "announcements" : "blog";
  const [articles, announcements] = await Promise.all([
    getBlogArticles(),
    getPublishedShopAnnouncements(),
  ]);
  const shopAnnouncements = announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    body: announcement.body,
    tags: announcement.tags,
    sourceLabel:
      typeof announcement.shop === "object" ? announcement.shop.name : null,
    priority: announcement.priority ?? "medium",
    publishedAt: announcement.publishedAt,
    createdAt: announcement.createdAt,
  }));

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
          <BlogTabs
            articles={articles}
            shopAnnouncements={shopAnnouncements}
            initialTab={initialTab}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
