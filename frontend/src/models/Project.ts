export interface Project {
    id: number;
    user_id: string;
    participants?: { email: string }[];
    name: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
  }
  