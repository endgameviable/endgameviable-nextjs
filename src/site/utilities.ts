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

export function canonicalizeUrl(url: string): string {
    const newUrl = stripIndexJson(url);
    if (!newUrl.endsWith('/'))
        return newUrl + '/';
    return newUrl;
}
