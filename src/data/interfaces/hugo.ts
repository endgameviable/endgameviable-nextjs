export interface HugoJsonPage {
    metadata?: {
        title?: string;
        summary?: string;
        type?: string;
        images?: string[];
        alternates?: string[];
        tags?: string[];
        categories?: string[];
    }
    date: string; // format: ISO 8601 yyyy-mm-ddThh:mm:ss-zzzz
    link: string;
    content?: string;
    plain?: string;
    children?: HugoJsonPage[];
}
