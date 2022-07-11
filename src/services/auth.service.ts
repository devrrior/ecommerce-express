import jwt from 'jsonwebtoken';

import ITokens from '../interfaces/tokens.interface';
import ITokensActions from '../interfaces/tokensActions.interface';
import IUser from '../interfaces/user.interface';
import SessionModel from '../models/session.model';

class AuthService implements ITokensActions {
  async createTokens(user: Partial<IUser>): Promise<ITokens> {
    const tokens: ITokens = {
      access: this.createAccessToken(user),
      refresh: await this.createRefreshToken(user),
    };

    return tokens;
  }

  createAccessToken(user: Partial<IUser>): string {
    const ACCESS_TOKEN_SECRET_KEY =
      process.env.ACCESS_TOKEN_SECRET_KEY || '1234';

    return jwt.sign(user, ACCESS_TOKEN_SECRET_KEY);
  }

  async createRefreshToken(user: Partial<IUser>): Promise<string> {
    const session = await SessionModel.create({ user: user._id });

    const REFRESH_TOKEN_SECRET_KEY =
      process.env.REFRESH_TOKEN_SECRET_KEY || '1234';

    return jwt.sign({ session: session._id }, REFRESH_TOKEN_SECRET_KEY);
  }
}

export default new AuthService();
