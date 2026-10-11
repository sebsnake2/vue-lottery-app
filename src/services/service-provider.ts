import { AuthService } from "./auth.service";
import { UserService } from "./user.service";

export class ServiceProvider {
  private static userService?: UserService;
  private static authService?: AuthService;

  static get users(): UserService {
    if (!this.userService) {
      this.userService = new UserService();
    }

    return this.userService;
  }

  static get auth(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService();
    }

    return this.authService;
  }
}