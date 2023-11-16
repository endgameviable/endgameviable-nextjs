import { micromark } from 'micromark';

export function plainToHTML(content: string): string {
  return content;
}

export function markdownToHTML(content: string): string {
  return micromark(content);
}
