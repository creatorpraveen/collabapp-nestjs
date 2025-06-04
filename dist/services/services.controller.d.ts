import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto, req: any): Promise<{
        ownerId: string;
        title: string;
        description: string;
        id: string;
    }>;
    findMyServices(req: any): Promise<import("cassandra-driver").types.Row[]>;
    findOne(id: string): Promise<import("cassandra-driver").types.Row>;
}
