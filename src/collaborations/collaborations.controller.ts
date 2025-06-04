import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CollaborationsService } from './collaborations.service';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { CollaborationStatus } from './collaboration-status.enum';

@Controller('collaborations')
export class CollaborationsController {
  constructor(private readonly collaborationsService: CollaborationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCollaborationDto: CreateCollaborationDto,
    @Request() req,
  ) {
    return this.collaborationsService.create(
      createCollaborationDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyCollaborations(@Request() req) {
    return this.collaborationsService.findByUserId(
      req.user.userId,
      req.user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.collaborationsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CollaborationStatus,
    @Request() req,
  ) {
    return this.collaborationsService.updateStatus(id, req.user.userId, status);
  }
}
