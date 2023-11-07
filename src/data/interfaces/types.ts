import { micromark } from 'micromark';

// Text with an associated contentType
export class TextType {
    public text: string
    public contentType: string

    constructor(text: string, contentType: string = "text/plain") {
        this.text = text
        this.contentType = contentType
    }

    public toHTML(): string {
        switch(this.contentType) {
            case "text/plain":
                return this.text
            case "text/markdown":
                return micromark(this.text)
            default:
                return ""
        }
    }
}
