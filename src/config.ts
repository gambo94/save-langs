// Generic configuration values

export const config = {
  nanoid: {
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    maxRetries: 5,
    length: 10,
    extendedLength: 12,
    readable: {
      length: 10,
      alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    },
  },
  jwt: {
    secret: 'your_jwt_secret_here',
    expiresIn: '1h',
  },
  supportedLangs: ['fanés'],
  roleList: ['admin', 'user', 'moderator'],
} as const;