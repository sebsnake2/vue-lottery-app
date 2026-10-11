import { http } from "../api/http-client";
import type {
  User,
  UsersResponse,
  CreateUserDto,
  UpdateUserDto,
} from "../types/user";
import type {
  Readable,
  Creatable,
  Editable,
  Deletable,
} from "./interfaces";

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll(
    {
      limit = 10,
      skip = 0,
    }: {
      limit?: number;
      skip?: number;
    } = {},
  ): Promise<User[]> {
    const data = await http<UsersResponse>(
      `/users?limit=${limit}&skip=${skip}`,
    );

    return data.users;
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`);
  }

  search(
    query: string,
    {
      limit = 10,
      skip = 0,
    }: {
      limit?: number;
      skip?: number;
    } = {},
  ): Promise<UsersResponse> {
    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
      skip: String(skip),
    });

    return http<UsersResponse>(
      `/users/search?${params.toString()}`,
    );
  }

  getList(
    {
      limit = 10,
      skip = 0,
    }: {
      limit?: number;
      skip?: number;
    } = {},
  ): Promise<UsersResponse> {
    return http<UsersResponse>(
      `/users?limit=${limit}&skip=${skip}`,
    );
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>("/users/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  update(
    id: number,
    data: UpdateUserDto,
  ): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: number): Promise<void> {
    await http<User>(`/users/${id}`, {
      method: "DELETE",
    });
  }
}