// Everything is chaos even in Typescript
export function safeParseDate(s: string): Date {
    if (s === null || s === undefined || s === "")
        return new Date(0)
    const parsedMillis = Date.parse(s)
    const dt = new Date(parsedMillis)
    if (dt !== null) return dt
    return new Date(0)
}
