// OBSOLETE

import { ContentSource } from './contentFile';

export interface ContentRoute {
  slug: string;
  route: string;
  source: ContentSource;
  element: number; // array index if it's a e.g. yaml
}

export function getFullRoute(route: ContentRoute): string {
  return [route.route, route.slug].join('/');
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replaceAll(' ', '-');
}
