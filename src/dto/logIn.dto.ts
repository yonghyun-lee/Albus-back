import { IsString } from 'class-validator';

class LogInDto {
  @IsString()
  public grant_type: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;
}

export default LogInDto;