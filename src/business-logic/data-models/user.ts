export interface CreateUserModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username: string;
    isActive: boolean;
    number: string;
    roleId?: number;
}

export interface LoginModel {
    email: string;
    password: string;
}

export interface UserGridModel {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    number: string;
}
