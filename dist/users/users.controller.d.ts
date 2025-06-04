import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("./dto/create-user.dto").UserRole;
    }>;
    getProfile(req: any): Promise<import("cassandra-driver").types.Row>;
}
