import { generateState } from "oslo/oauth2";
import { OAuth2Client } from "oslo/oauth2";
import { GoogleInterface } from "../interfaces/Google.interface";

export class GoogleRepository implements GoogleInterface {
  async genState(): Promise<string> {
    const state = await generateState();

    return state;
  }

  async callback(
    code: string,
  ): Promise<{ access_token: string; id_token: string }> {
    const authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const callback = process.env.GOOGLE_CALLBACK as string;
    const clientId = process.env.GOOGLE_CLIENT_ID as string;
    const clientSecret = process.env.GOOGLE_SECRET as string;

    const client = new OAuth2Client(
      clientId,
      authorizeEndpoint,
      tokenEndpoint,
      {
        redirectURI: callback,
      },
    );

    const tokens = await client.validateAuthorizationCode(code, {
      credentials: clientSecret,
      authenticateWith: "request_body",
    });

    const { access_token, id_token } = tokens as {
      access_token: string;
      id_token: string;
    };
    return { access_token, id_token };
  }

  async getUser(access_token: string): Promise<{
    name: string;
    picture?: string | undefined;
    email: string;
    email_verified: boolean;
  }> {
    const response = await fetch(
      `https://openidconnect.googleapis.com/v1/userinfo?access_token=${access_token}`,
    );
    const responseJson = (await response.json()) as {
      name: string;
      picture?: string | undefined;
      email: string;
      email_verified: boolean;
    };

    return responseJson;
  }

  async getLink(state: string): Promise<string> {
    const authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const callback = process.env.GOOGLE_CALLBACK as string;
    const clientId = process.env.GOOGLE_CLIENT_ID as string;
    const client = new OAuth2Client(
      clientId,
      authorizeEndpoint,
      tokenEndpoint,
      {
        redirectURI: callback,
      },
    );

    const url = await client.createAuthorizationURL({
      state,
      scopes: ["profile email"],
    });

    return url.toString();
  }
}
