import { gql } from '@apollo/client';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username) {
      token
      user {
        id
        username
        email
        isVerified
        profile {
          bio
          age
          city
        }
        subscription {
          plan
          status
        }
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// ─── Me / Profile ─────────────────────────────────────────────────────────────

export const ME = gql`
  query Me {
    me {
      id
      username
      email
      isVerified
      profile {
        bio
        age
        city
        interests
        photos
      }
      subscription {
        plan
        status
        expiresAt
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      bio
      age
      city
      interests
      photos
    }
  }
`;

// ─── Swipe ───────────────────────────────────────────────────────────────────

export const SWIPE_FEED = gql`
  query SwipeFeed($limit: Int) {
    swipeFeed(limit: $limit) {
      id
      username
      profile {
        bio
        age
        city
        photos
        gender

        interests
      }
    }
  }
`;

export const SWIPE = gql`
  mutation Swipe($toUserId: ID!, $direction: String!) {
    swipe(toUserId: $toUserId, direction: $direction) {
      matched
      matchId
    }
  }
`;

// ─── Matches ─────────────────────────────────────────────────────────────────

export const MY_MATCHES = gql`
  query MyMatches {
    myMatches {
      id
      users {
        id
        username
        profile {
          photos
          city
        }
      }
      createdAt
    }
  }
`;

// ─── Search ──────────────────────────────────────────────────────────────────

export const SEARCH_USERS = gql`
  query SearchUsers($q: String!, $limit: Int, $city: String, $minAge: Int, $maxAge: Int) {
    searchUsers(q: $q, limit: $limit, city: $city, minAge: $minAge, maxAge: $maxAge) {
      id
      username
      profile {
        bio
        age
        city
        photos
      }
    }
  }
`;

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const CREATE_CHAT = gql`
  mutation CreateChat($userId: ID!) {
    createChat(userId: $userId) {
      id
    }
  }
`;

export const CHAT_LIST = gql`
  query ChatList($limit: Int) {
    chatList(limit: $limit) {
      id
      participants {
        id
        username
        profile {
          photos
        }
      }
      lastMessage {
        text
        createdAt
      }
    }
  }
`;

export const MESSAGES = gql`
  query Messages($chatId: ID!, $limit: Int) {
    messages(chatId: $chatId, limit: $limit) {
      id
      text
      sender {
        id
        username
      }
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $text: String) {
    sendMessage(chatId: $chatId, text: $text) {
      id
      text
      sender {
        id
        username
      }
      createdAt
    }
  }
`;

// ─── Shorts ──────────────────────────────────────────────────────────────────

export const SHORTS_FEED = gql`
  query ShortsFeed($limit: Int) {
    shortsFeed(limit: $limit) {
      id
      videoUrl
      caption
      author {
        id
        username
        profile {
          photos
        }
      }
      createdAt
    }
  }
`;

export const UPLOAD_SHORT = gql`
  mutation UploadShort($videoUrl: String!, $caption: String) {
    uploadShort(videoUrl: $videoUrl, caption: $caption) {
      id
      videoUrl
      caption
    }
  }
`;

// ─── Subscription ─────────────────────────────────────────────────────────────

export const SUBSCRIBE = gql`
  mutation Subscribe($plan: String!) {
    subscribe(plan: $plan) {
      plan
      status
      expiresAt
    }
  }
`;

// ─── Follow / Unfollow ────────────────────────────────────────────────────────

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    userProfile(userId: $userId) {
      id
      username
      isFollowing
      followerCount
      followingCount
      profile {
        bio
        age
        city
        interests
        photos
      }
      subscription {
        plan
        status
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      isFollowing
      followerCount
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      id
      isFollowing
      followerCount
    }
  }
`;

export const ME_WITH_COUNTS = gql`
  query MeWithCounts {
    me {
      id
      username
      email
      isVerified
      followerCount
      followingCount
      profile {
        bio
        age
        city
        interests
        photos
      }
      subscription {
        plan
        status
        expiresAt
      }
    }
  }
`;
