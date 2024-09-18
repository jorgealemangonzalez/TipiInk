// Base webhook event structure
interface WebhookEvent {
    object: string;
    entry: Entry[];
}

interface Entry {
    id: string;
    time: number;
    messaging: MessagingEvent[];
}

interface MessagingEvent {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    message: Message;
    postback?: Postback;
    delivery?: Delivery;
    read?: Read;
}

// Message object within a messaging event
interface Message {
    mid: string;
    seq?: number;
    text?: string;
    attachments?: Attachment[];
    quick_reply?: {
        payload: string;
    };
}

interface Attachment {
    type: string;
    payload: unknown;
}

// Postback object within a messaging event
interface Postback {
    title: string;
    payload: string;
}

// Delivery object within a messaging event
interface Delivery {
    mids: string[];
    watermark: number;
    seq: number;
}

// Read object within a messaging event
interface Read {
    watermark: number;
    seq: number;
}
