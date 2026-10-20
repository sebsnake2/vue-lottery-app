import { UserService } from "@/entities/user";
import { AuthService } from "@/entities/session";
import { ServiceProvider } from "@/shared/api";

export function registerServices(): void {
  ServiceProvider.register(
    "users",
    () => new UserService(),
  );

  ServiceProvider.register(
    "auth",
    () => new AuthService(),
  );
}