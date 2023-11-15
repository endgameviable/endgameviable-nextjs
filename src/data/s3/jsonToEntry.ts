import { safeParseDateMillis, safeStringify } from "@/typeConversion";
import Entry from "../interfaces/entry";
import { TextType } from "../interfaces/types";
import { JsonDataPage } from "./fetchFromS3";

// Convert the json returned from S3 endpoints to an Entry
export function jsonToEntry(json: JsonDataPage): Entry {
    return {
        timestamp: safeParseDateMillis(safeStringify(json.date)),
        route: safeStringify(json.link),
        summary: new TextType(safeStringify(json.summary), "text/html"),
        article: new TextType(safeStringify(json.content), "text/html"),
        title: json.title,
    };
}
