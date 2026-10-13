import { apiBaseUrl } from "./api";
import type { PublicArticle } from "./articles";

export type BlogArticle = PublicArticle & {
  articleType?:
    | number
    | {
        id: number;
        name: string;
        code: string;
      }
    | null;
};

type BlogListResponse = { docs: BlogArticle[] };
const blogEndpoint = `${apiBaseUrl}/blog-articles`;

const fetchBlog = async (url: string) =>
  fetch(url, { next: { revalidate: 60 } });

export async function getBlogArticles() {
  const url = new URL(blogEndpoint);
  url.searchParams.set("where[status][equals]", "published");
  url.searchParams.set("sort", "-publishedAt");
  url.searchParams.set("limit", "100");
  url.searchParams.set("depth", "1");
  const response = await fetchBlog(url.toString());
  if (!response.ok)
    throw new Error(`Blog API request failed: ${response.status}`);
  return ((await response.json()) as BlogListResponse).docs;
}

export async function getBlogArticle(id: string) {
  const response = await fetchBlog(
    `${blogEndpoint}/${encodeURIComponent(id)}?depth=1`,
  );
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error(`Blog API request failed: ${response.status}`);
  return (await response.json()) as BlogArticle;
}
