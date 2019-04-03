import HttpException from './HttpException';

class UsernameAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(400, `username ${username} already exists`);
  }
}

export default UsernameAlreadyExistsException;