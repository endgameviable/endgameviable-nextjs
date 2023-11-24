import { canonicalizePath } from "@/site/utilities";
import { safeStringify } from "@/types/strings";
import { DynamoDBClient, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient } from "@config/siteConfig";
import Entry from "../interfaces/entry";
import { safeParseDateMillis } from "@/types/dates";
import { TextType } from "@/types/contentText";
import { getContentAtRouteS3 } from "../s3/fetchFromS3";

export async function getContentAtRouteDynamo(route: string[]): Promise<Entry> {
    const key = canonicalizePath(route.join('/'));
    const command = new GetItemCommand({
        TableName: 'endgameviable-generated-content',
        Key: {
            entryPath: { S: key },
        }
    });
    try {
        const response = await dynamoClient.send(command);
        if (response.Item) {
            console.log(`got ${key} from dynamoDB`);
            const item = response.Item;
            return {
                type: safeStringify(item.entryType.S),
                timestamp: safeParseDateMillis(item.entryDate.S),
                route: safeStringify(item.entryPath.S),
                summary: new TextType(item.entrySummary.S, 'text/plain'),
                article: new TextType(item.entryContent.S, 'text/html'),
                title: item.entryTitle.S,
                image: item.entryImage.S,
            };
        }
    } catch (error) {
        console.log(error);
    }
    return getContentAtRouteS3(route);
}

// export async function getContentAtRoute(route: string[]): Promise<Entry> {
//     const key = canonicalizePath(route.join('/'));
//     // Query for all posts that begin with the given path
//     const command = new QueryCommand({
//         TableName: 'endgameviable-generated-content',
//         KeyConditionExpression: 'begins_with(entryPath, :prefix)',
//         ExpressionAttributeValues: {
//             ':prefix': { S: key },
//         },
//         ScanIndexForward: false,
//         Limit: 20,
//     });
//     const response = await dynamoClient.send(command);
//     if (response.Items) {
//         // get children pages
//         const children: Entry[] = response.Items
//             .filter((item) => (item.path.S !== key))
//             .map((item) => ({
//                 type: safeStringify(item.entryType.S),
//                 timestamp: safeParseDateMillis(item.entryDate.S),
//                 route: safeStringify(item.entryPath.S),
//                 summary: new TextType(item.entrySummary.S, 'text/plain'),
//                 article: new TextType(item.entryContent.S, 'text/html'),
//                 title: item.entryTitle.S,
//                 image: item.entryImage.S,
//             }));
//         const entry: Entry = response.Items
//             .filter((item) => (item.path.S === key))
//             .map((item) => ({
//                 type: safeStringify(item.entryType.S),
//                 timestamp: safeParseDateMillis(item.entryDate.S),
//                 route: safeStringify(item.entryPath.S),
//                 summary: new TextType(item.entrySummary.S, 'text/plain'),
//                 article: new TextType(item.entryContent.S, 'text/html'),
//                 title: item.entryTitle.S,
//                 image: item.entryImage.S,
//                 children: children,
//             }))[0];
//         return entry;
//     }
// }

export async function fetchJsonFromDynamo(client: DynamoDBClient, route: string[]): Promise<EndpointData> {
    const key = canonicalizePath(route.join('/'));
    console.log("key", key);
    const command = new GetItemCommand({
        TableName: 'endgameviable-generated-content',
        Key: {
            path: { S: key },
        }
    });
    const response = await client.send(command);
    if (response.Item) {
        const item = response.Item;
        return {
            path: safeStringify(item.path.S),
            date: safeStringify(item.date.S),
            title: safeStringify(item.title.S),
            summary: safeStringify(item.summary.S),
            content: safeStringify(item.content.S),
            image: safeStringify(item.image.S),
        };
    } else {
        return {
            path: key,
            date: new Date().toISOString(),
            title: 'Error',
            summary: 'Could not fetch the path',
            content: 'Could not fetch the path',
            image: '',
        };
    }
}
