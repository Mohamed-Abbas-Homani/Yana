export interface User {
  id?: number; // Primary key, auto-incremented (optional)
  name?: string; // User's first name (optional)
  nickName?: string; // User's nickname (optional)
  language?: string; // User's preferred language (optional)
  hint?: string; // Hint color (optional)
  password?: string; // User's password (optional)
  createdAt?: Date; // Timestamp of when the user was created (optional)
  updatedAt?: Date; // Timestamp of when the user was last updated (optional)
}
