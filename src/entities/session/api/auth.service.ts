import { http } from "@/shared/api";

import type {
  AuthUser,
  LoginDto,
  LoginResponse,
  RefreshResponse,
} from "../model/types";

export class AuthService {
  login(data: LoginDto): Promise<LoginResponse> {
    return http<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
      skipRefresh: true,
    });
  }

  getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>("/auth/me");
  }

  refresh(
    refreshToken: string,
  ): Promise<RefreshResponse> {
    return http<RefreshResponse>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({
          refreshToken,
        }),
        skipAuth: true,
        skipRefresh: true,
      },
    );
  }
}