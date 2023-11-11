export default function Page({
  params,
}: {
  params: { source: string; pagenum: string };
}) {
  return (
    <main>
      <p>
        Page {params.pagenum} of the list from {params.source}
      </p>
      <p>From the source {params.source}</p>
      <p>
        Sources can be things like blog posts from different categories (gaming,
        music, reviews, etc.) or a data sources such as a movie or book
        database.
      </p>
      <p>
        List pages should be in ascending order, so page 1 are the earliest
        entries, not the latest. That way, the contents of each pagination list
        will remain static. If it were sorted descending order, each time a new
        entry is added, <i>every</i> page would change. If sorted ascending,
        only the most recent one or two pages will need to change.
      </p>
      <p>
        If we move from a static to a dynamic site, we don&apos;t really need
        these pages, actually.
      </p>
    </main>
  );
}
