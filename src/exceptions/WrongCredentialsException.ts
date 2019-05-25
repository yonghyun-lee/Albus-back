import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(403, `Wrong Credentials!`);
  }
}

export default WrongCredentialsException;