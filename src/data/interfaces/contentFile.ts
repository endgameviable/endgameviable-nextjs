// Describes a path to a content entry,
// and an interface to read the content there.
export interface ContentFile {
  path: string; // relative path to the content
  name: string; // default name of the content (a "slug" or filename, without an extension)
  readContent(): Promise<string>; // function to read content from source
}

export interface ContentSource {
  name: string; // hopefully unique name of the content
  readContent(): Promise<string>; // function to read content from source
}

// Thanks ChatGPT
export function getBaseName(filename: string): string {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex === -1) {
    // If there's no dot (.), return the entire filename.
    return filename;
  }
  // Extract the part of the filename before the last dot.
  return filename.substring(0, lastIndex);
}
