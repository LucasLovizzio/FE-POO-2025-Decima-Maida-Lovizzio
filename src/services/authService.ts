import api from "./api"

import type {
  LoginRequest,
  AuthResponse,
  CreateParticipantRequest,
  CreateParticipantResponse,
  AdminLoginRequest,
} from "../types"

export const authService = {
  loginParticipant: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth", data),

  loginAdmin: (data: AdminLoginRequest) =>
    api.post<AuthResponse>("/admin/auth", data),

  registerParticipant: (data: CreateParticipantRequest) =>
    api.post<CreateParticipantResponse>("/account", data),
}