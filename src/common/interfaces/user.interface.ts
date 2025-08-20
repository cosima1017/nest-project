export interface IUser {
    id: number;
    username: string;
    password: string;
    nickname?: string | null;  // 使用可选和可空类型
    email?: string | null;
    phone?: string | null;
    avatar?: string | null;
    status: boolean;  // 移除 null，因为在 schema 中是必填
    lastLoginTime?: Date | null;
    lastLoginIp?: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: number | null;
    updatedBy?: number | null;
    userRoles?: any[];
    roleIds?: number[];  // 添加这个属性用于创建时传递角色ID
}


