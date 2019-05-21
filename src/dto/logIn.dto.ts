import { IsString } from 'class-validator';

class SocialLogInDto {
  @IsString()
  public accessToken: string;
}

export default SocialLogInDto;