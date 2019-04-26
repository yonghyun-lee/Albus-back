import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

class SocialRegisterBodyDto {

  @IsString()
  @IsNotEmpty()
  public accessToken: string;

  @Matches(/^[a-z0-9-_]+$/)
  @MinLength(3)
  @MaxLength(16)
  username: string;

  @IsEmail()
  fallbackEmail: string;

}

export default SocialRegisterBodyDto;