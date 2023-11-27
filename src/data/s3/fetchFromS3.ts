import path from 'path';
import PageContent from '../interfaces/content';
import { safeStringify } from '@/types/strings';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, contentBucketName } from '@config/resourceConfig';
import { canonicalizePath } from '@/site/utilities';
import { safeParseDateMillis } from '@/types/dates';
import { TextType } from '@/types/contentText';

interface HugoJsonPage {
    date?: string; // format: ISO 8601 yyyy-mm-ddThh:mm:ss-zzzz
    title?: string;
    summary?: string;
    content?: string;
    plain?: string;
    link?: string;
    type?: string;
    alternates?: string[];
    images?: string[];
    children?: HugoJsonPage[];
}

export async function getContentAtRouteS3(
    route: string[],
): Promise<PageContent> {
    const key = path.join(route.join('/'), 'index.json');
    try {
        const data = await getContentObject(key);
        if (data.children && data.children.length > 0) {
            // List page
            const children = jsonToEntries(data.children);
            return jsonToEntry(data, children);
        } else {
            // Single page
            return jsonToEntry(data, []);
        }
    } catch (error) {
        console.log(error);
        return {
            timestamp: Date.now(),
            route: canonicalizePath(route.join('/')),
            article: new TextType(
                `There was an error fetching content from S3: ${error} It's probably a misconfiguration somewhere in the infrastructure.`,
            ),
        };
    }
}

export async function getContentObject(key: string): Promise<HugoJsonPage> {
    const command = new GetObjectCommand({
        Bucket: contentBucketName,
        Key: key,
    });
    const response = await s3Client.send(command);
    if (response.Body) {
        const s = await response.Body?.transformToString();
        return JSON.parse(s);
    }
    return {};
}

// Convert the json returned from S3 endpoints to an Entry
export function jsonToEntry(
    json: HugoJsonPage,
    children: PageContent[] = [],
): PageContent {
    let image: string | undefined = undefined;
    if (json.images) {
        image = json.images[0];
    }
    return {
        timestamp: safeParseDateMillis(safeStringify(json.date)),
        route: canonicalizePath(safeStringify(json.link)),
        summary: new TextType(safeStringify(json.summary), 'text/plain'),
        article: new TextType(safeStringify(json.content), 'text/html'),
        title: json.title,
        type: json.type,
        image: image,
        children: children,
    };
}

export function jsonToEntries(dataPages: HugoJsonPage[]): PageContent[] {
    const entries: PageContent[] = [];
    for (const jsonPage of dataPages) {
        const entry = jsonToEntry(jsonPage, []);
        entries.push(entry);
    }
    return entries;
}
