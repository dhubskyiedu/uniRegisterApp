import { createContext } from "react";
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
export interface UserCreds{
    username: string,
    password: string
}

export type UserInfoContextType = {
    userInfo: UserInfo,
    setUserInfo: (info: UserInfo) => void
}

export const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

