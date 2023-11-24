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
