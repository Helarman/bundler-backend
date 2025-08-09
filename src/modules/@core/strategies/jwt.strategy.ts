import { JwtUserEntity } from "../decorators/user.decorator";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(jwtUser: JwtUserEntity) {
    const user = await this.usersService.getUserById(jwtUser.id);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
