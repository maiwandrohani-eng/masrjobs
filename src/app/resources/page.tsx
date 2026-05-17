import { ResourcesContent } from "@/components/ResourcesContent";
import { resourceArticleSummaries } from "@/lib/resources-articles";
import { getResourceArticleListMeta } from "@/lib/resources-read-time";

const articles = resourceArticleSummaries().map((a) => {
  const meta = getResourceArticleListMeta(a.slug);
  return {
    ...a,
    author: meta.author,
    readTimeMinutes: meta.readTimeMinutes,
  };
});

export default function ResourcesPage() {
  return <ResourcesContent articles={articles} />;
}
