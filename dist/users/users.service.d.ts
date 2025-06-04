import { CassandraService } from '../database/cassandra.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private cassandraService;
    constructor(cassandraService: CassandraService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("./dto/create-user.dto").UserRole;
    }>;
    findByEmail(email: string): Promise<import("cassandra-driver").types.Row | null>;
    findById(id: string): Promise<import("cassandra-driver").types.Row>;
    validatePassword(user: any, password: string): Promise<boolean>;
}
