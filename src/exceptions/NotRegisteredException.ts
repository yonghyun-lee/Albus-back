import HttpException from './HttpException';

class NotRegisteredException extends HttpException {
  constructor(email: string) {
    super(401, `Not Registered ${email}`);
  }
}

export default NotRegisteredException;