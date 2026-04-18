import { XMLParser } from "fast-xml-parser";
import { Episode } from "@/types/podcast";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function parseDuration(input?: string) {
  if (!input) return null;
  if (/^\d+$/.test(input)) {
    return Number(input);
  }
  const parts = input.split(":").map(Number);
  if (parts.some(isNaN)) return null;
  let seconds = 0;
  if (parts.length === 3) {
    const [h, m, s] = parts;
    seconds = h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    const [m, s] = parts;
    seconds = m * 60 + s;
  }
  return seconds;
}

const promiseCache = new Map<string, Promise<{ episodes: Episode[] }>>();
const resultCache = new Map<string, { episodes: Episode[] }>();

export async function fetchPodcastFeed(feedUrl: string): Promise<{
  episodes: Episode[];
}> {
  // already resolved — return instantly, no await
  if (resultCache.has(feedUrl)) {
    return resultCache.get(feedUrl)!;
  }

  // fetch in flight — attach to same promise
  if (promiseCache.has(feedUrl)) {
    return promiseCache.get(feedUrl)!;
  }

  // nothing yet — start fetch
  const promise = fetch(feedUrl)
    .then((res) => res.text())
    .then((xml) => {
      const json = parser.parse(xml);
      const channel = json.rss.channel;
      const items = Array.isArray(channel.item) ? channel.item : [channel.item];

      const episodes: Episode[] = items.map((item: any) => {
        const enclosure = item.enclosure;
        return {
          id: item.guid?.["#text"] || item.guid || item.title,
          title: item.title,
          audioUrl: enclosure?.["@_url"] || "",
          published: item.pubDate,
          description: item.description,
          duration: parseDuration(item["itunes:duration"]),
          image: item["itunes:image"]?.["@_href"] || null,
        };
      });

      const result = { episodes };
      resultCache.set(feedUrl, result);
      promiseCache.delete(feedUrl);
      return result;
    });

  promiseCache.set(feedUrl, promise);
  return promise;
}