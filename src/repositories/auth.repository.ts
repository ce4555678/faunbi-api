import { AuthInteface, VerifyHash } from "../interfaces/auth.interface";
import * as argon2 from "argon2";

export class AuthRepository implements AuthInteface {
  async verifyPassword(data: VerifyHash): Promise<boolean> {
    const valid = await argon2.verify(data.hash, data.password);
    return valid;
  }
}
