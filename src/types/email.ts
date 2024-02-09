export interface MimeAttachment {
    filename: string;
    contentType: string;
    data: string;
}

export interface Email {
    to: string;
    subject: string;
    body: string;
    altBody?: string;
    fromEmail: string;
    fromName: string;
    replyToEmail?: string;
    replyToName?: string;
    bounceEmail?: string;
    cc?: string[];
    attachments?: string[];
}
