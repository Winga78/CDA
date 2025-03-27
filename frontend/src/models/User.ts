export interface User {
    firstname: string;
    lastname : string;
    email: string;
    password: string;
    birthday : string;
}

export interface UserUpdate {
    firstname: string;
    lastname : string;
    password: string;
    avatar: string;
}