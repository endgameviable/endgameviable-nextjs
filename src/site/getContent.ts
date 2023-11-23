import Entry from "@/data/interfaces/entry";
import { getContentAtRouteS3 } from "@/data/s3/fetchFromS3";

export async function getContentAtRoute(route: string[]): Promise<Entry> {
    return getContentAtRouteS3(route);
}
