import jwt from 'jsonwebtoken';

import ITokensActions from '../interfaces/actions/tokensActions.interface';
import ITokens from '../interfaces/models/tokens.interface';
import IUser from '../interfaces/models/user.interface';
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

    return jwt.sign(user, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '5m' });
  }

  async createRefreshToken(user: Partial<IUser>): Promise<string> {
    const session = await SessionModel.create({ user: user._id });

    const REFRESH_TOKEN_SECRET_KEY =
      process.env.REFRESH_TOKEN_SECRET_KEY || '1234';

    return jwt.sign({ session: session._id }, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: '1d',
    });
  }
}

export default new AuthService();
