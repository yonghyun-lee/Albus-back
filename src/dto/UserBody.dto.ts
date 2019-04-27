import {IsEmail, Length, Matches, MaxLength, MinLength} from 'class-validator';

class UserBodyDto {

  @Matches(/^[a-z0-9-_]+$/)
  @MinLength(3)
  @MaxLength(16)
  public username: string;

  @IsEmail()
  public email: string;
}

export default UserBodyDto;