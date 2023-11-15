import { GetObjectCommand, GetObjectCommandInput, S3Client } from "@aws-sdk/client-s3";

export interface JsonMetadata {
    content?: string;
    section?: string;
};

export interface JsonDataPage {
    date?: string;
    title?: string;
    summary?: string;
    content?: string;
    link?: string;
};

export interface JsonDataEndpoint {
    metadata: JsonMetadata;
    pages: JsonDataPage[];
};

export async function fetchJsonFromS3(s3: S3Client, route: string[]): Promise<JsonDataEndpoint> {
    const key = route.join('/') + '/index.json';
    try {
        const params: GetObjectCommandInput = {
            Bucket: 'endgameviable-nextjs-storage',
            Key: key,
        };
        const response = await s3.send(new GetObjectCommand(params));
        if (response.Body) {
            const s = await response.Body?.transformToString();
            return JSON.parse(s);
        }
        console.log('no response body from s3 object');
    } catch (error) {
        console.log('error loading file:', error);
    }
    return {
        metadata: { content: "error", section: "error" },
        pages: [{ title: "Nothing Here", content: "There was an error fetching this data." }]
    };
}
