import Entry from "../interfaces/entry";
import EntryQueryParams from "../interfaces/queryFilter";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient, searchContentTableName } from "@config/resourceConfig";
import { getS } from "./fetchFromDynamo";
import { safeParseDateMillis } from "@/types/dates";
import { safeStringify } from "@/types/strings";
import { TextType } from "@/types/contentText";

export async function searchEntriesDynamo(params: EntryQueryParams): Promise<Entry[]> {
    console.log(`scanning ${searchContentTableName} for search parameters`);
    let lastKey: any = undefined;
    const children: Entry[] = [];
    do {
        const command = new ScanCommand({
            TableName: searchContentTableName,
            ExclusiveStartKey: lastKey,
            FilterExpression: 'contains(pageSearchContent, :searchKeyword)',
            ExpressionAttributeValues: {
                ':searchKeyword': { S: params.contains.toLowerCase() },
            },
        });
        const response = await dynamoClient.send(command);
        if (response.Items && response.Items.length > 0) {
            const entries: Entry[] = response.Items.map((item) => ({
                type: 'page',
                timestamp: safeParseDateMillis(getS(item.pageDate)),
                route: safeStringify(getS(item.pagePath)),
                summary: new TextType(getS(item.pageSummary), 'text/plain'),
                article: new TextType(getS(item.pageContentHtml), 'text/html'),
                title: getS(item.pageTitle),
                image: getS(item.pageImage),
            }));
            children.push(...entries);
        }
        lastKey = response.LastEvaluatedKey;
    } while (lastKey);
    if (children.length > 0) {
        children.sort((a, b) => (b.timestamp - a.timestamp));
        console.log(`search found ${children.length} items`);
        return children;
    }
    console.log(`search didn't find any results`);
    return [];
}
