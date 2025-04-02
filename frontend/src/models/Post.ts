export interface Post {
    id?: string;
    user_id: string;
    project_id: string;
    titre: string;
    description: string;
    score? : string;
    createdAt?: string;
    modifiedAt?: string;
}
  