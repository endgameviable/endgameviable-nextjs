import Entry from "./entry"

// Describes a generic file interface.
export interface FileDataSource {
    //getEntry(route: string): Promise<Entry>
    getRoutes(): Promise<string[]>
    getEntries(): Promise<Entry[]>
}
