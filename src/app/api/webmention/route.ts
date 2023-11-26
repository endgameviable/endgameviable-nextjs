import { sendMessage } from "@/data/sqs/send";
import { safeStringify } from "@/types/strings";
import { siteConfig } from "@config/siteConfig";
import { randomUUID } from "crypto";

function error400(message: string): Response {
    console.log(message);
    return new Response(message, {
        status: 400,
    });
}

export async function POST(request: Request) {
    let data: FormData;
    // Very basic validations
    try {
        data = await request.formData();
    } catch (error) {
        return error400('Cannot parse form data');
    }
    if (!data.get('source')) {
        return error400('No source parameter');
    }
    if (!data.get('target')) {
        return error400('No target parameter');
    }
    const source = safeStringify(data.get('source')?.toString());
    const target = safeStringify(data.get('target')?.toString());
    try {
        const sourceUrl = new URL(source);
    } catch (error) {
        return error400('Cannot parse source url');
    }
    try {
        const targetUrl = new URL(target);
    } catch (error) {
        return error400('Cannot parse target url');
    }
    if (source === target) {
        return error400('Source cannot equal target');
    }
    // Queue webmention processing
    const success = await sendMessage({
        eventType: 'webmention',
        eventID: randomUUID(), // todo: don't need
        eventDate: new Date().toISOString(),
        eventHost: siteConfig.siteHost,
        eventPayload: {
            source: source,
            target: target,
        }
    });
    if (success) {
        return new Response('WebMention Queued', {
            status: 202,
        });
    }
    return Response.error();
}
