import * as jwt from 'jsonwebtoken'
import User from "@interface/user.interface";

class Token {
  private readonly issuer: string;
  private readonly TOKEN_SECRET_KEY: string;
  private readonly expiredIn: string;

  constructor() {
    this.issuer = 'albus.io';
    this.TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
    this.expiredIn = '7d';
  }

  public generate = (payload: any, options?: any): Promise<string>  => {
    const jwtOptions = {
      issuer: this.issuer,
      expiresIn: this.expiredIn,
      ...options
    };

    if (!jwtOptions.expiresIn) {
      delete jwtOptions.expiresIn;
    }

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.TOKEN_SECRET_KEY, jwtOptions, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  };

  public decode = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  };

  public generateLoginToken = async (userInfo: User): Promise<string> => {

    const {id, username, thumbnail} = userInfo;

    const user = {
      id,
      username,
      thumbnail
    };

    return this.generate({ user });
  }
}

export default new Token();