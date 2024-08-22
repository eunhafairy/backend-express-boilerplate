export interface CreateUserModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username: string;
    isActive: boolean;
    number: string;
}

export interface LoginModel {
    email: string;
    password: string;
}
