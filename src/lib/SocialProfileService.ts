import { google } from 'googleapis';
import SocialProfileInterface from "@interface/socialProfile.interface";
import 'dotenv/config';

class SocialProfileService {

  public getGoogleProfile = (accessToken: string): Promise<SocialProfileInterface> => {
    const plus = google.plus({
      version: 'v1',
      auth: process.env.GOOGLE_SECRET,
    });

    return new Promise<SocialProfileInterface>(((resolve, reject) => {
      plus.people.get({
        userId: 'me',
        oauth_token: accessToken
      },(err, auth) => {
        if (err) {
          reject(err);
          return;
        }
        const {
          id, image, emails, displayName,
        } = auth.data;

        const profile = {
          id,
          thumbnail: image.url,
          email: emails[0].value,
          username: displayName && displayName.split(' (')[0],
        };
        resolve(profile);
      })
    }))
  }
}

export const socialService = new SocialProfileService();