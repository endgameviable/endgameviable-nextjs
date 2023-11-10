import { ContentFile } from "./contentFile"
import { ContentRoute } from "./contentRoute"
import Entry from "./entry"

// An interface to index all the entry routes within a file,
// and to retrieve all the entries within that file.
// The file might return one entry (e.g. a markdown file),
// or it might return multiple entries (e.g. a YAML file).
// The routes should describe how to fetch each entry.
// Routes are typically constructed as a path and a slug.
// e.g. posts/gaming/2023/10/my_gaming_post
// e.g. movies/1931/dracula
// The first part of the route determines what kind of data.
// The final part of the route is a unique slug.
// All routes must be unique across the entire site.
export interface ContentFileReader {
    getRoutes(file: ContentFile): Promise<ContentRoute[]>
    getEntry(route: ContentRoute): Promise<Entry>
    //getEntries(file: ContentFile): Promise<Entry[]>
}
