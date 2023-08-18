import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhsot:4000"

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: `${API_ENDPOINT}/auth/facebook/redirect`,
      scope: "email",
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}