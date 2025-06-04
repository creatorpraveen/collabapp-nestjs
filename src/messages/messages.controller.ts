import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    return this.messagesService.create({
      ...createMessageDto,
      senderId: req.user.userId,
    });
  }

  @Get('collaboration/:collaborationId')
  async getCollaborationMessages(
    @Param('collaborationId') collaborationId: string,
    @Request() req,
  ) {
    return this.messagesService.findByCollaborationId(
      collaborationId,
      req.user.sub,
    );
  }
}
