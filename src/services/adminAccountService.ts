import api from './api'
import type { AdminAccount, CreateAdminRequest, CreateAdminResponse } from '../types'

export const adminAccountService = {
  getAll: () => api.get<AdminAccount[]>('/admin/accounts'),

  create: (data: CreateAdminRequest) => api.post<CreateAdminResponse>('/admin/accounts', data),

  delete: (id: number) => api.delete(`/admin/accounts/${id}`),
}
