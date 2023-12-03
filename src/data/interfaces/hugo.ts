export interface HugoJsonPage {
    date?: string; // format: ISO 8601 yyyy-mm-ddThh:mm:ss-zzzz
    title?: string;
    summary?: string;
    content?: string;
    plain?: string;
    link?: string;
    type?: string;
    alternates?: string[];
    images?: string[];
    children?: HugoJsonPage[];
}
