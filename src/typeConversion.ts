// Everything is chaos even in Typescript
export function safeParseDate(s: string): Date {
  if (s === null || s === undefined || s === '') return new Date(0);
  const parsedMillis = Date.parse(s);
  const dt = new Date(parsedMillis);
  if (dt !== null) return dt;
  return new Date(0);
}

// Assumes UTC time zone
export function safeParseDateMillis(s: string): number {
  if (s === null || s === undefined || s === '') return 0;
  return Date.parse(s);
}

export function safeStringify(s: any, defaultValue: string = ''): string {
  if (s === null || s === undefined) return defaultValue;
  const stringified: string = s.toString();
  if (stringified === '') return defaultValue;
  return stringified;
}

export function safeTextSearch(searchIn: any, searchFor: string): boolean {
  // Yeesh why is it so hard to deal with strings
  if (searchFor === null || searchFor === undefined || searchFor === '')
    return false;
  if (searchIn === null || searchIn === undefined) return false;
  const content: string = searchIn.toString();
  if (content === null || content === undefined || content === '') return false;
  return content.toLowerCase().includes(searchFor.toLowerCase());
}
