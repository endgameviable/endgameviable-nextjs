import { siteConfig } from "@config/siteConfig";

export function siteUrl(relUrl: string): string {
    return siteConfig.routeHostName + relUrl;
}

export function stripIndexJson(url: string): string {
    if (url && url.endsWith('/index.json')) {
        return url.substring(0, url.length - '/index.json'.length);
    }
    return url;
}

// Path = /path/to/content
export function canonicalizePath(path: string): string {
    if (path === '') return '/';
    let newPath = stripIndexJson(path);
    if (!newPath.startsWith('/'))
        newPath = '/' + newPath;
    if (newPath.endsWith('/'))
        newPath = newPath.substring(0, newPath.length - 1);
    return newPath;
}

// Route is same as path but does not have a leading /
export function canonicalizeRoute(path: string): string {
    let route = canonicalizePath(path);
    if (route.startsWith('/'))
        route = route.substring(1);
    return route;
}

export function ensureTrailingSlash(path: string): string {
    if (path.endsWith('/'))
        return path;
    return path + '/';
}
