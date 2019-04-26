import HttpException from './HttpException';

class InternalServerException extends HttpException {
  constructor(error?: Error) {
    console.error(error);
    super(500, `Internal Server Error`);
  }
}

export default InternalServerException;