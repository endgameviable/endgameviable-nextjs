import Entry from "@/data/interfaces/entry";
import { getContentAtRouteDynamo } from "@/data/dynamo/fetchFromDynamo";
import { getContentAtRouteS3 } from "@/data/s3/fetchFromS3";

export async function getContentAtRoute(route: string[]): Promise<Entry> {
    return getContentAtRouteDynamo(route);
}
