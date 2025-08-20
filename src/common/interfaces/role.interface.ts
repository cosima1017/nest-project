export interface IRole {
    id: number;
    name: string;
    code: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
}