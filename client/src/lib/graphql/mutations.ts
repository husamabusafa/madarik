import { gql } from '@apollo/client';

// Invitation Mutations
export const INVITE_USER = gql`
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      id
      email
      invitedRole
      status
      expiresAt
      createdAt
    }
  }
`;

export const RESEND_INVITATION = gql`
  mutation ResendInvitation($id: ID!) {
    resendInvitation(id: $id)
  }
`;

export const REVOKE_INVITATION = gql`
  mutation RevokeInvitation($id: ID!) {
    revokeInvitation(id: $id)
  }
`;

export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($input: AcceptInvitationInput!) {
    acceptInvitation(input: $input) {
      id
      email
      role
      isActive
      emailVerifiedAt
      preferredLocale
    }
  }
`;

// User Management Mutations
export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $input: UpdateUserRoleInput!) {
    updateUserRole(id: $id, input: $input) {
      id
      email
      role
      isActive
      emailVerifiedAt
      lastLoginAt
      createdAt
      preferredLocale
    }
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($id: ID!, $input: UpdateUserStatusInput!) {
    updateUserStatus(id: $id, input: $input) {
      id
      email
      role
      isActive
      emailVerifiedAt
      lastLoginAt
      createdAt
      preferredLocale
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      role
      isActive
      emailVerifiedAt
      lastLoginAt
      createdAt
      preferredLocale
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: ID!, $input: UpdateProfileInput!) {
    updateUserProfile(id: $id, input: $input) {
      id
      email
      role
      isActive
      emailVerifiedAt
      lastLoginAt
      createdAt
      preferredLocale
    }
  }
`;
