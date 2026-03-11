import api from './api'
import type { AdminAccount } from '../types'

export const adminAccountService = {
  getAll: () => api.get<AdminAccount[]>('/admin/accounts'),

  delete: (id: number) => api.delete(`/admin/accounts/${id}`),
}
