import PageContent from "@/data/interfaces/content";
import { getContentAtRouteS3 } from "@/data/s3/fetchFromS3";
import { getContentAtRouteDynamo } from "@/data/dynamo/fetchFromDynamo";

export async function getContentAtRoute(route: string[]): Promise<PageContent> {
    return getContentAtRouteS3(route);
}
