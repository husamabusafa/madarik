import { ApolloClient } from '@apollo/client';
import { apolloClient } from './apollo';
import {
  GET_USERS,
  GET_INVITATIONS,
  GET_USER_STATS,
  GET_USERS_FOR_ASSIGNMENT,
  GET_ME,
} from './graphql/queries';
import {
  CREATE_INVITE,
  RESEND_INVITE,
  REVOKE_INVITE,
  ACCEPT_INVITE,
  DELETE_INVITE,
  UPDATE_USER_ROLE,
  UPDATE_USER_STATUS,
  UPDATE_PROFILE,
  UPDATE_USER_PROFILE,
} from './graphql/mutations';

interface InviteUserRequest {
  email: string;
  role: 'ADMIN' | 'MANAGER';
  message?: string;
}

interface UserInvite {
  id: string;
  email: string;
  invitedRole: 'ADMIN' | 'MANAGER';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  inviterUserId: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
  inviter?: {
    id: string;
    email: string;
  };
  acceptedUser?: {
    id: string;
    email: string;
  };
}

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER';
  isActive: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  preferredLocale: 'EN' | 'AR';
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  managerUsers: number;
}

class GraphQLApiService {
  private client: ApolloClient;

  constructor() {
    this.client = apolloClient;
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const result = await this.client.query({
      query: GET_USERS,
    } as any);
    const data = (result as any).data as any;
    return data.users as User[];
  }

  async getUserStats(): Promise<UserStats> {
    const result = await this.client.query({
      query: GET_USER_STATS,
    } as any);
    const data = (result as any).data as any;
    return data.userStats as UserStats;
  }

  async getUsersForAssignment(): Promise<User[]> {
    const result = await this.client.query({
      query: GET_USERS_FOR_ASSIGNMENT,
    } as any);
    const data = (result as any).data as any;
    return data.usersForAssignment as User[];
  }

  async getMe(): Promise<User> {
    const result = await this.client.query({
      query: GET_ME,
    } as any);
    const data = (result as any).data as any;
    return data.me as User;
  }

  async updateUserRole(userId: string, role: 'ADMIN' | 'MANAGER'): Promise<User> {
    const result = await this.client.mutate({
      mutation: UPDATE_USER_ROLE,
      variables: {
        id: userId,
        input: { role },
      },
      refetchQueries: [{ query: GET_USERS }, { query: GET_USER_STATS }],
    } as any);
    const data = (result as any).data as any;
    return data.updateUserRole as User;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const result = await this.client.mutate({
      mutation: UPDATE_USER_STATUS,
      variables: {
        id: userId,
        input: { isActive },
      },
      refetchQueries: [{ query: GET_USERS }, { query: GET_USER_STATS }],
    } as any);
    const data = (result as any).data as any;
    return data.updateUserStatus as User;
  }

  async updateProfile(preferredLocale?: 'EN' | 'AR'): Promise<User> {
    const result = await this.client.mutate({
      mutation: UPDATE_PROFILE,
      variables: {
        input: { preferredLocale },
      },
      refetchQueries: [{ query: GET_ME }],
    } as any);
    const data = (result as any).data as any;
    return data.updateProfile as User;
  }

  async updateUserProfile(userId: string, preferredLocale?: 'EN' | 'AR'): Promise<User> {
    const result = await this.client.mutate({
      mutation: UPDATE_USER_PROFILE,
      variables: {
        id: userId,
        input: { preferredLocale },
      },
      refetchQueries: [{ query: GET_USERS }],
    } as any);
    const data = (result as any).data as any;
    return data.updateUserProfile as User;
  }

  // Invitation methods
  async inviteUser(request: InviteUserRequest): Promise<UserInvite> {
    const result = await this.client.mutate({
      mutation: CREATE_INVITE,
      variables: {
        input: {
          email: request.email,
          role: request.role,
          message: request.message || '',
        },
      },
      refetchQueries: [{ query: GET_INVITATIONS }, { query: GET_USER_STATS }],
    } as any);
    const data = (result as any).data as any;
    return data.createInvite as UserInvite;
  }

  async getInvites(): Promise<UserInvite[]> {
    const result = await this.client.query({
      query: GET_INVITATIONS,
    } as any);
    const data = (result as any).data as any;
    return data.invites as UserInvite[];
  }

  async resendInvite(inviteId: string): Promise<UserInvite> {
    const result = await this.client.mutate({
      mutation: RESEND_INVITE,
      variables: { id: inviteId },
      refetchQueries: [{ query: GET_INVITATIONS }],
    } as any);
    const data = (result as any).data as any;
    return data.resendInvite as UserInvite;
  }

  async revokeInvite(inviteId: string): Promise<UserInvite> {
    const result = await this.client.mutate({
      mutation: REVOKE_INVITE,
      variables: { id: inviteId },
      refetchQueries: [{ query: GET_INVITATIONS }],
    } as any);
    const data = (result as any).data as any;
    return data.revokeInvite as UserInvite;
  }

  async deleteInvite(inviteId: string): Promise<boolean> {
    const result = await this.client.mutate({
      mutation: DELETE_INVITE,
      variables: { id: inviteId },
      refetchQueries: [{ query: GET_INVITATIONS }],
    } as any);
    const data = (result as any).data as any;
    return data.deleteInvite as boolean;
  }

  async acceptInvite(token: string, password: string, preferredLocale?: 'EN' | 'AR') {
    const result = await this.client.mutate({
      mutation: ACCEPT_INVITE,
      variables: {
        input: { token, password, preferredLocale },
      },
    } as any);
    const data = (result as any).data as any;
    return data.acceptInvite as { token: string; user: User };
  }

  // Helper method to refetch all data
  async refetchAll(): Promise<void> {
    await Promise.allSettled([
      this.client.refetchQueries({ include: [GET_USERS] }),
      this.client.refetchQueries({ include: [GET_INVITATIONS] }),
      this.client.refetchQueries({ include: [GET_USER_STATS] }),
    ]);
  }
}

export const graphqlApiService = new GraphQLApiService();
export type { InviteUserRequest, UserInvite, User, UserStats };
