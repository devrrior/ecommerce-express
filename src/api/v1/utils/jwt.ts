import jwt from 'jsonwebtoken';

const verifyJWT = <T>(
  token: string,
  typeOfToken: 'access' | 'refresh'
): T | null => {
  try {
    const ACCESS_TOKEN_SECRET_KEY =
      process.env.ACCESS_TOKEN_SECRET_KEY || '1234';
    const REFRESH_TOKEN_SECRET_KEY =
      process.env.REFRESH_TOKEN_SECRET_KEY || '1234';

    if (typeOfToken === 'access') {
      return jwt.verify(token, ACCESS_TOKEN_SECRET_KEY) as T;
    } else if (typeOfToken === 'refresh') {
      return jwt.verify(token, REFRESH_TOKEN_SECRET_KEY) as T;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export { verifyJWT };
