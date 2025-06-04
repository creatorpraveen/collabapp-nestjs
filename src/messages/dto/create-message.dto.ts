import { IsString, IsUUID, IsEnum } from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  CODE = 'code',
  FILE = 'file',
}

export class CreateMessageDto {
  @IsUUID()
  collaborationId: string;

  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;
}
