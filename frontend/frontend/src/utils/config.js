// export const serverURL = 'http://localhost:8089'
export const serverURL = "http://localhost:8080";

export const ACCESS_TOKEN = "accessToken";

export const OAUTH2_REDIRECT_URI = "http://localhost:3000/oauth2/redirect";

export const OAUTH2_REDIRECT_URI_BE = serverURL + `/oauth2/code/google`;

export const CLIENT_ID =
  "764804901350-gt40h9hs5keh26bki56upr9fck9781js.apps.googleusercontent.com";

export const CLIENT_SECRET = "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";

export const GOOGLE_AUTH_URL =
  serverURL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URI;
