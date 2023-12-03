import { PageContent } from '@/data/interfaces/content';
import { getContentAtRouteLocal } from '@/data/local/fetchFromLocal';
//import { getContentAtRouteS3 } from '@/data/s3/fetchFromS3';

export async function getContentAtRoute(route: string[]): Promise<PageContent> {
    return getContentAtRouteLocal(route);
}
