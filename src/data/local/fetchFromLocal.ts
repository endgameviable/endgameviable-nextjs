import path from "path";
import { promises as fs } from 'fs';
import PageContent from "@/data/interfaces/content";
import { HugoJsonPage, jsonToEntries, jsonToEntry } from "../s3/fetchFromS3";

// TODO: Ever heard of classes? OOP? Yeah, do that.
// Make a provider class and implementations for S3, Dynamo, and local.
// Although, to be fair, we're only going to pick one to use.

export const getContentAtRouteLocal = async (route: string[]): Promise<PageContent> => {
    const pathname = path.join(process.cwd(), 
        'content', 
        route.join('/'), 
        'index.json');
    const body = await fs.readFile(pathname, 'utf8');
    const data: HugoJsonPage = JSON.parse(body);
    if (data.children && data.children.length > 0) {
        // List page
        const children = jsonToEntries(data.children);
        return jsonToEntry(data, children);
    } else {
        // Single page
        return jsonToEntry(data, []);
    }
}
