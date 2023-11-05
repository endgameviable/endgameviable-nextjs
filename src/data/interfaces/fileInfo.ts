import { Stats } from 'fs'

export default interface FileInfo {
    path: string
    stats: Stats
    content: string
}
