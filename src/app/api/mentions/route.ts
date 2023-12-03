import { Mention } from '@/data/interfaces/mention';
import { ensureHttps } from '@/site/utilities';
import { safeStringify } from '@/types/strings';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { dynamoClient } from '@config/awsDynamoClient';
import { ENV, getEnv } from '@config/env';

// TODO: Someday might need to turn this into a paged interface.
// If e.g. there are hundreds or thousands of mentions (har).

async function lookupUrl(url: string): Promise<any> {
    const notificationTableName = getEnv(ENV.METADATA_TABLE);
    const command = new GetItemCommand({
        TableName: notificationTableName,
        Key: {
            url: { S: url },
        },
    });
    return dynamoClient.send(command).then((data) => data.Item);
}

async function getThread(instance?: string, id?: string): Promise<Mention[]> {
    if (!instance || !id) return [];
    const mastodonApiToken = getEnv(ENV.MASTODON_TOKEN);
    const mentions: Mention[] = [];
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${mastodonApiToken}`);
    instance = ensureHttps(instance);
    const apiUrl = `${instance}/api/v1/statuses/${id}/context`;
    console.log(`querying ${apiUrl}`);
    await fetch(apiUrl, { method: 'GET', headers: headers })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.descendants) {
                for (const status of data.descendants) {
                    mentions.push({
                        date: safeStringify(status.created_at),
                        content: safeStringify(status.text),
                        url: status.url,
                    });
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
    return mentions;
}

export async function GET(request: Request) {
    const startTime = performance.now();
    const { searchParams } = new URL(request.url);
    const url = safeStringify(searchParams.get('url'));

    // Lookup url in the metadata linking table.
    // The table holds links from urls to metadata.
    let mentions: Mention[] = [];
    const item = await lookupUrl(url);
    if (item) {
        const instanceName = item.activityPubInstance.S;
        const statusId = item.activityPubStatusID.S;
        if (instanceName && statusId) {
            // If we have a link to an ActivityPub status ID,
            // call Mastodon api to fetch related statuses.
            mentions = await getThread(instanceName, statusId);
        }
    }

    const elapsed = performance.now() - startTime;
    console.log(`got ${mentions.length} mentions for ${url} in ${elapsed}ms`);

    return Response.json(mentions);
}
