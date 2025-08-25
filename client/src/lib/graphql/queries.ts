import { gql } from '@apollo/client';

// User Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
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

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      role
      isActive
      emailVerifiedAt
      preferredLocale
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats {
    userStats {
      totalUsers
      activeUsers
      adminUsers
      managerUsers
    }
  }
`;

export const GET_USERS_FOR_ASSIGNMENT = gql`
  query GetUsersForAssignment {
    usersForAssignment {
      id
      email
      role
    }
  }
`;

// Invitation Queries
export const GET_INVITATIONS = gql`
  query GetInvites {
    invites {
      id
      email
      invitedRole
      status
      inviterUserId
      expiresAt
      createdAt
      acceptedAt
      inviter {
        id
        email
      }
      acceptedUser {
        id
        email
      }
    }
  }
`;

