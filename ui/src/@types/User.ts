export interface User {
    displayName: string,
    userName: string,
    token: string,
    image?: string
}

export interface LoginUser {
    email: string,
    password: string
}

export interface RegisterUser {
    email: string,
    password: string,
    displayName: string,
    userName: string
}

export const Token = {
    JWT: "jwt_token"
}