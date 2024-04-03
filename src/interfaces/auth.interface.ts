export interface AuthEmail {
  email: string;
  password: string;
}

export interface VerifyHash {
  password: string;
  hash: string;
}

export interface AuthInteface {
  verifyPassword(data: VerifyHash): Promise<boolean>;
}
