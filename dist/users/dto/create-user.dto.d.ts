export declare enum UserRole {
    BUYER = "buyer",
    SELLER = "seller"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}
