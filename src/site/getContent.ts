import Entry from "@/data/interfaces/entry";
import { getContentAtRouteS3 } from "@/data/s3/fetchFromS3";
import { getContentAtRouteDynamo } from "@/data/dynamo/fetchFromDynamo";

export async function getContentAtRoute(route: string[]): Promise<Entry> {
    return getContentAtRouteS3(route);
}
