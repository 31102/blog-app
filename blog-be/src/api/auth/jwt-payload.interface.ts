export interface JwtPayload {
    sub: string; // User ID or any unique identifier
    username: string; // Optional, include username or any other field
  }