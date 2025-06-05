import { checkUnauthorized, post } from "../common/api";
import { PostAccessTokenRequest, PostAccessTokenResponse } from "./types/authTypes";

export const postUserAccessTokens = async (domain: string, email: string, password: string) => {
  return await post<PostAccessTokenResponse, PostAccessTokenRequest>("/auth/login-tokens", {
    username: email,
    password,
    domain,
  }).then((response) => {
    //console.log("Auth Response:", response); // Debug log
    return checkUnauthorized(response);
  });
};

export const postSignup = async (name: string, email: string, password: string) => {
  const domain = `${email}_domain`;

  return await post("/auth/setup-workspace", {
    name,
    domain,
    username: email,
    password,
  }
  ).then(checkUnauthorized);
};
