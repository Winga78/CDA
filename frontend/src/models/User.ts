export interface User {
    _id? : string
    firstname: string;
    lastname : string;
    email: string;
    password: string;
    birthday : string;
    avatar? : string;
}

export interface UserUpdate {
    firstname: string;
    lastname : string;
    password: string;
    avatar: string;
}