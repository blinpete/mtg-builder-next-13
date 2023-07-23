export type LoginData = {
  email: string
  password: string
}

export type RegisterData = LoginData & {
  name: string
}

export type RegisterRequest = Omit<Request, "json"> & {
  json: () => Promise<RegisterData>
}
