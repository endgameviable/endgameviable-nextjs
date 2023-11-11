import Entry from '@/data/interfaces/entry';
import EntryQueryParams from '@/data/interfaces/queryFilter';
import { ContentFile } from './contentFile';
import { ContentRoute } from './contentRoute';

export default interface EntryProvider {
  // TODO: Update to paged interfaces.

  // Get the one entry specified by the route
  getEntry(route: ContentFile): Promise<Entry>;

  // Get all entries available
  getAllEntries(): Promise<Entry[]>;

  // Query for a subset of entries
  queryEntries(filter: EntryQueryParams): Promise<Entry[]>;
}
