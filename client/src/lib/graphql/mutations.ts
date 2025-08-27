import { gql } from '@apollo/client';

// Invitation Mutations
export const CREATE_INVITE = gql`
  mutation CreateInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      id
      email
      invitedRole
      status
      expiresAt
      createdAt
    }
  }
`;

export const RESEND_INVITE = gql`
  mutation ResendInvite($id: ID!) {
    resendInvite(id: $id) {
      id
      email
      invitedRole
      status
      expiresAt
      createdAt
    }
  }
`;

export const REVOKE_INVITE = gql`
  mutation RevokeInvite($id: ID!) {
    revokeInvite(id: $id) {
      id
      email
      invitedRole
      status
      expiresAt
      createdAt
    }
  }
`;

export const DELETE_INVITE = gql`
  mutation DeleteInvite($id: ID!) {
    deleteInvite(id: $id)
  }
`;

export const ACCEPT_INVITE = gql`
  mutation AcceptInvite($input: AcceptInviteInput!) {
    acceptInvite(input: $input) {
      token
      user {
        id
        email
        role
        isActive
        emailVerifiedAt
        preferredLocale
      }
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

// Tools / Diagnostics
export const SEND_TEST_EMAIL = gql`
  mutation SendTestEmail($input: SendTestEmailInput!) {
    sendTestEmail(input: $input) {
      success
      messageId
      skipped
      error
      raw
    }
  }
`;

// Listings Mutations
export const CREATE_LISTING = gql`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      status
      propertyType
      listingType
      price
      currency
      areaValue
      areaUnit
      bedrooms
      bathrooms
      parking
      yearBuilt
      addressLine
      city
      country
      lat
      lng
      zoomHint
      primaryPhotoUrl
      publishedAt
      createdAt
      updatedAt
      translations {
        id
        locale
        title
        description
        displayAddressLine
        areaName
        slug
        createdAt
        updatedAt
      }
    }
  }
`;
