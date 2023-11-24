import Entry from "@/data/interfaces/entry";
import EntryListLayout from '@/components/server/entryList';
import SingleEntryPage from '@/components/server/entrySinglePage';
import MicroPostEntryLayout from '@/components/server/entryMicropost';
import { getContentAtRoute } from "./getContent";
import { safeStringify } from "@/types/strings";

// Detect which view component to use to render
// the given json page data.
// There are basically three kinds:
// - A section view, which is a list of posts
// - A post view, which is a single post article
// - A micropost view, which is a single microblog post
function getView(entry: Entry): JSX.Element {
    let component: JSX.Element;
    if (entry.children && entry.children.length > 0) {
      component = <EntryListLayout
        title={safeStringify(entry.title)}
        content={safeStringify(entry.article)}
        list={entry.children} />;
    } else {
      if (entry.type === 'micropost') {
        component = <MicroPostEntryLayout entry={entry} />;
      } else {
        component = <SingleEntryPage entry={entry} />;
      }
    }
    return component;
}  
  
export async function standardPageComponent(route: string[]): Promise<JSX.Element> {
    const startTime = performance.now();
    const entry = await getContentAtRoute(route);
    const component = getView(entry);
    const elapsed = performance.now() - startTime;
    return (
      <main>
        {component}
        <footer>
          <p>Page was generated in {elapsed.toFixed(2)}ms.</p>
        </footer>
      </main>
    );  
}