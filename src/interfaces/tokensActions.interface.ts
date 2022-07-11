import ITokens from './tokens.interface';
import IUser from './user.interface';

interface ITokensActions {
  createTokens: (user: Partial<IUser>) => Promise<ITokens>;
  createAccessToken: (user: Partial<IUser>) => string;
  createRefreshToken: (user: Partial<IUser>) => Promise<string>;
}

export default ITokensActions;
