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
