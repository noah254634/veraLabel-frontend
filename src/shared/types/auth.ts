export type LoginData = {
    email: string
    password: string
}
export type RegisterData = {
    name: string
    username: string
    email: string
    password: string
}
export type AuthResponse = {
    token: string
    user: {
        id: number
        name: string
        username: string
        email: string
    }
}