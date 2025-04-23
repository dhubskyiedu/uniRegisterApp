export interface UserInfo{
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    groupID?: string
}
export interface User extends UserInfo{
    password: string
}