import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // TODO: This is where we can theoretically redirect
  // to different places based on a hostname.
  // So e.g. domaina.com could display a sub-directory
  // of pages while domainb.com shows a different sub-dir.
  // This is also where we can accomplish redirects
  // from older post paths to newer paths.
  const url = new URL(req.url);
  if (!url.pathname.startsWith('/_next')) {
    console.log('requesting:', url.hostname, url.pathname);
  }
  if (redirectPaths[url.pathname]) {
    const newURL = `${url.protocol}//${url.hostname}:${url.port}${redirectPaths[url.pathname]}`;
    console.log('redirecting to:', newURL);
    return NextResponse.redirect(newURL);
  }
  return NextResponse.next();
}

type redirectPath = { [key: string]: string };

// A list of redirects to test with
const redirectPaths: redirectPath = {
  '/glazed-donuts': '/blog',
  '/super-sized': '/movies',
};
