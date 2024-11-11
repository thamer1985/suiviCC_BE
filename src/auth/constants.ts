export const jwtSecret = process.env.JWT_SECRET;

export enum UserRole{
    SysAdmin='SysAdmin',
    Admin='Admin',
    DG='DG',
    User='User',
}