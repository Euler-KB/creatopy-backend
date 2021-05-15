import {User} from "../models/User";

export type UserInfo = {
    id: number
};

export type ContextType = {
    user?: UserInfo
}

export type LoginInput = {
    username: string
    password: string
}

export type ForgotPasswordInput = {
    username: string
}

export type ResetPasswordInput = {
    id: number
    code: string
    newPassword: string
    confirmPassword
}

export type SignUpInputs = {
    username: string
    name: string
    phone: string | null
    email: string | null
    password: string
    confirmPassword: string
};

export type AuthenticationTicket = {
    accessToken: string
    user: User
}

export type LoginResponse = {
    status: null | "invalid_credentials" | "success",
    ticket: AuthenticationTicket
}
