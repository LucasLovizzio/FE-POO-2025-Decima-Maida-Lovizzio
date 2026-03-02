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
    api.post<AuthResponse>("/auth/login", data),

  loginAdmin: (data: AdminLoginRequest) =>
    api.post<AuthResponse>("/auth/admin/login", data),

  registerParticipant: (data: CreateParticipantRequest) =>
    api.post<CreateParticipantResponse>("/auth/register", data),
}