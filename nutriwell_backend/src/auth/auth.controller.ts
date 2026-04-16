import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() body: { email?: string; password?: string }, @Res({ passthrough: true }) res: Response) {
    const session = await this.auth.login(body.email ?? "", body.password ?? "");
    res.cookie(this.auth.cookieName(), session.token, this.auth.cookieOptions());
    return { session, user: session.user };
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[this.auth.cookieName()];
    await this.auth.logout(token);
    res.clearCookie(this.auth.cookieName(), { path: "/" });
    return { success: true };
  }

  @Get("session")
  async getSession(@Req() req: Request) {
    const token = req.cookies?.[this.auth.cookieName()];
    return { session: await this.auth.session(token) };
  }

  @Get("me")
  async me(@Req() req: Request) {
    const token = req.cookies?.[this.auth.cookieName()];
    const session = await this.auth.session(token);
    return { isAdmin: !!session && session.user.role === "admin", user: session?.user ?? null };
  }
}
