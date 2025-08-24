// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER'
}

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export enum Locale {
  EN = 'EN',
  AR = 'AR'
}

// Base Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  preferredLocale: Locale;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface Invitation {
  id: string;
  email: string;
  invitedRole: UserRole;
  status: InviteStatus;
  inviterUserId: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
  acceptedUserId?: string;
  inviter?: User;
  acceptedUser?: User;
}

// Input Types
export interface InviteUserInput {
  email: string;
  role: UserRole;
  message?: string;
}

export interface AcceptInvitationInput {
  token: string;
  password: string;
  preferredLocale?: string;
}

// Query Response Types
export interface GetUsersQuery {
  users: User[];
}

export interface GetMeQuery {
  me: User;
}

export interface GetUsersForAssignmentQuery {
  usersForAssignment: User[];
}

export interface GetInvitationsQuery {
  invitations: Invitation[];
}

// Mutation Response Types
export interface InviteUserMutation {
  inviteUser: Invitation;
}

export interface ResendInvitationMutation {
  resendInvitation: string;
}

export interface RevokeInvitationMutation {
  revokeInvitation: string;
}

export interface AcceptInvitationMutation {
  acceptInvitation: User;
}

// Variables Types
export interface InviteUserVariables {
  input: InviteUserInput;
}

export interface ResendInvitationVariables {
  id: string;
}

export interface RevokeInvitationVariables {
  id: string;
}

export interface AcceptInvitationVariables {
  input: AcceptInvitationInput;
}
