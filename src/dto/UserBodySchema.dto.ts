import {IsEmail, Length, MinLength} from 'class-validator';

class UserBodySchemaDto {

  @Length(3, 20)
  public username: string;

  @MinLength(3)
  public password: string;

  @IsEmail()
  public email: string;
}

export default UserBodySchemaDto;