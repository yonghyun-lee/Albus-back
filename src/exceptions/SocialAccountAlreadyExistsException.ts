import HttpException from './HttpException';

class SocialAccountAlreadyExistsException extends HttpException {
  constructor() {
    super(409, `Social account exists`);
  }
}

export default SocialAccountAlreadyExistsException;