import { renderToStaticMarkup } from 'react-dom/server';
import Page from './page';

// TODO: Trying to make a route that can render HTML the same way as page.tsx,
// and _also_ handle returning XML or JSON, depending on content-type.
// So far, not working.

export async function GET({ params }: { params: { route: string[] } }) {
  // Render the CommonPage component to HTML
  const html = renderToStaticMarkup(<Page params={params} />);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
