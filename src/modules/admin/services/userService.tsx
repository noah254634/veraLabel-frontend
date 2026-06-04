import { api } from "../../../shared/types/api";
import type { User } from "../../../shared/types/user";

// ResponseHandler shape: { success, message, data: <payload>, timestamp }
function unwrap<T>(res: any): T {
  return res?.data?.data ?? res?.data ?? res;
}

export const UserService = {
  fetchUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    const users = unwrap<User[]>(response);
    return Array.isArray(users) ? users : [];
  },

  promoteUser: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/promote`, { reason });
    return unwrap(response);
  },

  promoteToReviewer: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/promote-to-reviewer`, { reason });
    return unwrap(response);
  },

  demoteUser: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/demote`, { reason });
    return unwrap(response);
  },

  deleteUser: async (id: string, reason: string): Promise<void> => {
    const response = await api.delete(`admin/users/delete/${id}`, { data: { reason } });
    return unwrap(response);
  },

  updateUser: async () => {},
  addUser: async () => {},

  verifyUser: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/verify`, { reason });
    return unwrap(response);
  },

  unverifyUser: async (id: string, reason: string): Promise<void> => {
    const response = await api.put(`admin/users/${id}/unverify`, { reason });
    return unwrap(response);
  },

  blockUser: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/block`, { reason });
    return unwrap(response);
  },

  unblockUser: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/unblock`, { reason });
    return unwrap(response);
  },

  rateUser: async (id: string, rate: number): Promise<any> => {
    const response = await api.put(`admin/users/${id}/rate`, { rate });
    return unwrap(response);
  },

  suspendUser: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/suspend`, { reason });
    return unwrap(response);
  },

  unsuspendUser: async (id: string, reason: string): Promise<any> => {
    const response = await api.put(`admin/users/${id}/unsuspend`, { reason });
    return unwrap(response);
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`admin/${encodeURIComponent(id)}/users/`);
    return unwrap<User>(response);
  },

  getUserByEmail: async (email: string): Promise<User[]> => {
    const response = await api.get(`admin/users/${encodeURIComponent(email)}/email`);
    const users = unwrap<User[]>(response);
    return Array.isArray(users) ? users : [];
  },

  getUserByUsername: async (username: string): Promise<User[]> => {
    const response = await api.get(`admin/users/${encodeURIComponent(username)}/username`);
    const users = unwrap<User[]>(response);
    return Array.isArray(users) ? users : [];
  },

  getUserByRole: async (role: string): Promise<User[]> => {
    const response = await api.get(`admin/users/${encodeURIComponent(role)}/role`);
    const users = unwrap<User[]>(response);
    return Array.isArray(users) ? users : [];
  },

  getUserByStatus: async (status: string): Promise<User[]> => {
    const response = await api.get(`admin/users/${encodeURIComponent(status)}/status`);
    const users = unwrap<User[]>(response);
    return Array.isArray(users) ? users : [];
  },

  getUserByCountry: async (country: string): Promise<User[]> => {
    const response = await api.get(`admin/users/${encodeURIComponent(country)}/country`);
    const users = unwrap<User[]>(response);
    return Array.isArray(users) ? users : [];
  },

  getUserByCity: async (city: string): Promise<User[]> => {
    const response = await api.get(`admin/users/${encodeURIComponent(city)}/city`);
    const users = unwrap<User[]>(response);
    return Array.isArray(users) ? users : [];
  },

  fetchBuyers: async (status?: string): Promise<any[]> => {
    const url = status ? `/admin/buyers?status=${encodeURIComponent(status)}` : "/admin/buyers";
    const response = await api.get(url);
    const result = unwrap<any>(response);
    return Array.isArray(result) ? result : (result?.buyers || []);
  },

  approveBuyer: async (id: string): Promise<any> => {
    const response = await api.put(`/admin/buyers/${id}/approve`);
    return unwrap(response);
  },

  rejectBuyer: async (id: string, adminNotes: string): Promise<any> => {
    const response = await api.put(`/admin/buyers/${id}/reject`, { adminNotes });
    return unwrap(response);
  },
};
