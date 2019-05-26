import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

class SocialRegisterBodyDto {

  @IsString()
  @IsNotEmpty()
  public accessToken: string;

  @Matches(/^[가-힣]+$/)
  @MinLength(3)
  @MaxLength(16)
  username: string;

  @IsEmail()
  fallbackEmail: string;

}

export default SocialRegisterBodyDto;