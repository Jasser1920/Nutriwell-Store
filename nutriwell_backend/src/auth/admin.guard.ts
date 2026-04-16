import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.[this.auth.cookieName()];
    const session = await this.auth.session(token);
    if (!session || session.user.role !== "admin") {
      throw new UnauthorizedException("Authentication required");
    }
    request.adminSession = session;
    return true;
  }
}
