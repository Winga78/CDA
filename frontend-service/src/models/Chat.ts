import { User } from "./User";

export interface Chat {
    id?: string;
    user: User;
    post_id : string,
    vote : number,
    titre: string;
    description: string;
    modifiedAt?: string;
}
  