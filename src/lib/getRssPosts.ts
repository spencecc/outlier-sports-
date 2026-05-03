import { XMLParser } from "fast-xml-parser";

const RSS_URL = "https://rss.beehiiv.com/feeds/KP63St8OeS.xml";

export interface RssPost {
  title: string;
  date: string;
  excerpt: string;
  url: string;
}

export async function getRssPosts(limit?: number): Promise<RssPost[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml);

    const items = json?.rss?.channel?.item;
    if (!items) return [];

    const list = Array.isArray(items) ? items : [items];

    const posts: RssPost[] = list.map((item: Record<string, string>) => ({
      title: item.title ?? "Untitled",
      date: item.pubDate
        ? new Date(item.pubDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "",
      excerpt: stripHtml(item.description ?? ""),
      url: item.link ?? "#",
    }));

    return limit ? posts.slice(0, limit) : posts;
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}
