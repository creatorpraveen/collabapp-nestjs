export declare enum MessageType {
    TEXT = "text",
    CODE = "code",
    FILE = "file"
}
export declare class CreateMessageDto {
    collaborationId: string;
    content: string;
    type: MessageType;
}
