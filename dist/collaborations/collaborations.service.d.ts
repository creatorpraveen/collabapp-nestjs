import { CassandraService } from '../database/cassandra.service';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { CollaborationStatus } from './collaboration-status.enum';
import { UserRole } from '../users/dto/create-user.dto';
export declare class CollaborationsService {
    private cassandraService;
    constructor(cassandraService: CassandraService);
    create(createCollaborationDto: CreateCollaborationDto, buyerId: string): Promise<{
        id: string;
        buyerId: string;
        sellerId: string;
        serviceId: string;
        status: CollaborationStatus;
        createdAt: Date;
    }>;
    findById(id: string): Promise<import("cassandra-driver").types.Row>;
    findByUserId(userId: string, role: UserRole): Promise<import("cassandra-driver").types.Row[]>;
    updateStatus(id: string, userId: string, status: CollaborationStatus): Promise<{
        status: CollaborationStatus;
        get(columnName: string | number): any;
        keys(): string[];
        forEach(callback: (row: import("cassandra-driver").types.Row) => void): void;
        values(): any[];
    }>;
}
