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
  INVITE_USER,
  RESEND_INVITATION,
  REVOKE_INVITATION,
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
  inactiveUsers: number;
  adminUsers: number;
  managerUsers: number;
}

class GraphQLApiService {
  private client: ApolloClient<any>;

  constructor() {
    this.client = apolloClient;
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const { data } = await this.client.query({
      query: GET_USERS,
      fetchPolicy: 'cache-and-network',
    });
    return data.users;
  }

  async getUserStats(): Promise<UserStats> {
    const { data } = await this.client.query({
      query: GET_USER_STATS,
      fetchPolicy: 'cache-and-network',
    });
    return data.userStats;
  }

  async getUsersForAssignment(): Promise<User[]> {
    const { data } = await this.client.query({
      query: GET_USERS_FOR_ASSIGNMENT,
      fetchPolicy: 'cache-and-network',
    });
    return data.usersForAssignment;
  }

  async getMe(): Promise<User> {
    const { data } = await this.client.query({
      query: GET_ME,
      fetchPolicy: 'cache-and-network',
    });
    return data.me;
  }

  async updateUserRole(userId: string, role: 'ADMIN' | 'MANAGER'): Promise<User> {
    const { data } = await this.client.mutate({
      mutation: UPDATE_USER_ROLE,
      variables: {
        id: userId,
        input: { role },
      },
      refetchQueries: [{ query: GET_USERS }, { query: GET_USER_STATS }],
    });
    return data.updateUserRole;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const { data } = await this.client.mutate({
      mutation: UPDATE_USER_STATUS,
      variables: {
        id: userId,
        input: { isActive },
      },
      refetchQueries: [{ query: GET_USERS }, { query: GET_USER_STATS }],
    });
    return data.updateUserStatus;
  }

  async updateProfile(preferredLocale?: 'EN' | 'AR'): Promise<User> {
    const { data } = await this.client.mutate({
      mutation: UPDATE_PROFILE,
      variables: {
        input: { preferredLocale },
      },
      refetchQueries: [{ query: GET_ME }],
    });
    return data.updateProfile;
  }

  async updateUserProfile(userId: string, preferredLocale?: 'EN' | 'AR'): Promise<User> {
    const { data } = await this.client.mutate({
      mutation: UPDATE_USER_PROFILE,
      variables: {
        id: userId,
        input: { preferredLocale },
      },
      refetchQueries: [{ query: GET_USERS }],
    });
    return data.updateUserProfile;
  }

  // Invitation methods
  async inviteUser(request: InviteUserRequest): Promise<UserInvite> {
    const { data } = await this.client.mutate({
      mutation: INVITE_USER,
      variables: {
        input: {
          email: request.email,
          role: request.role,
          message: request.message || '',
        },
      },
      refetchQueries: [{ query: GET_INVITATIONS }, { query: GET_USER_STATS }],
    });
    return data.inviteUser;
  }

  async getInvites(): Promise<UserInvite[]> {
    const { data } = await this.client.query({
      query: GET_INVITATIONS,
      fetchPolicy: 'cache-and-network',
    });
    return data.invitations;
  }

  async resendInvite(inviteId: string): Promise<string> {
    const { data } = await this.client.mutate({
      mutation: RESEND_INVITATION,
      variables: { id: inviteId },
      refetchQueries: [{ query: GET_INVITATIONS }],
    });
    return data.resendInvitation;
  }

  async revokeInvite(inviteId: string): Promise<string> {
    const { data } = await this.client.mutate({
      mutation: REVOKE_INVITATION,
      variables: { id: inviteId },
      refetchQueries: [{ query: GET_INVITATIONS }],
    });
    return data.revokeInvitation;
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
