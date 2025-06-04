import { CassandraService } from '../database/cassandra.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesService {
    private cassandraService;
    constructor(cassandraService: CassandraService);
    create(createServiceDto: CreateServiceDto, ownerId: string): Promise<{
        ownerId: string;
        title: string;
        description: string;
        id: string;
    }>;
    findById(id: string): Promise<import("cassandra-driver").types.Row>;
    findByOwnerId(ownerId: string): Promise<import("cassandra-driver").types.Row[]>;
}
