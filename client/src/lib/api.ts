const API_BASE_URL = 'http://localhost:3100';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface InviteUserRequest {
  email: string;
  role: 'ADMIN' | 'MANAGER';
}

interface InviteUserResponse {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER';
  expiresAt: string;
}

interface UserInvite {
  id: string;
  email: string;
  invitedRole: 'ADMIN' | 'MANAGER';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  inviterUserId: string;
  expiresAt: string;
  createdAt: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Invitation methods
  async inviteUser(data: InviteUserRequest): Promise<InviteUserResponse> {
    const response = await this.request<InviteUserResponse>('/auth/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async resendInvite(inviteId: string): Promise<void> {
    await this.request(`/auth/invitations/${inviteId}/resend`, {
      method: 'POST',
    });
  }

  async revokeInvite(inviteId: string): Promise<void> {
    await this.request(`/auth/invitations/${inviteId}/revoke`, {
      method: 'POST',
    });
  }

  async getInvites(): Promise<UserInvite[]> {
    const response = await this.request<UserInvite[]>('/auth/invitations');
    return response.data;
  }

  // User methods
  async getUsers(): Promise<any[]> {
    const response = await this.request<any[]>('/users');
    return response.data;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    await this.request(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async resetUserPassword(userId: string): Promise<void> {
    await this.request(`/users/${userId}/reset-password`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export type { InviteUserRequest, InviteUserResponse, UserInvite };
