import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({
    example: 'your.access.token.here',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'your.refresh.token.here',
    description: 'JWT refresh token',
  })
  refreshToken: string;
}