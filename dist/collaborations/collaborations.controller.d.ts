import { CollaborationsService } from './collaborations.service';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { CollaborationStatus } from './collaboration-status.enum';
export declare class CollaborationsController {
    private readonly collaborationsService;
    constructor(collaborationsService: CollaborationsService);
    create(createCollaborationDto: CreateCollaborationDto, req: any): Promise<{
        id: string;
        buyerId: string;
        sellerId: string;
        serviceId: string;
        status: CollaborationStatus;
        createdAt: Date;
    }>;
    findMyCollaborations(req: any): Promise<import("cassandra-driver").types.Row[]>;
    findOne(id: string): Promise<import("cassandra-driver").types.Row>;
    updateStatus(id: string, status: CollaborationStatus, req: any): Promise<{
        status: CollaborationStatus;
        get(columnName: string | number): any;
        keys(): string[];
        forEach(callback: (row: import("cassandra-driver").types.Row) => void): void;
        values(): any[];
    }>;
}
