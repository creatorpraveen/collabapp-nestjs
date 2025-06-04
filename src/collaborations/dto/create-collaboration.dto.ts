import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCollaborationDto {
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @IsUUID()
  @IsNotEmpty()
  sellerId: string;
}
