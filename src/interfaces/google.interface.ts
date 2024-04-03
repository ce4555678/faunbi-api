export interface GoogleInterface {
  getLink(state: string): Promise<string>;

  genState(): Promise<string>;

  callback(
    state: string,
    storedState: string,
    code: string,
  ): Promise<{ access_token: string; id_token: string }>;

  getUser(access_token: string): Promise<{
    name: string;
    picture?: string;
    email: string;
    email_verified: boolean;
  }>;
}
