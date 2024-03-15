import * as postMark from "postmark";

const postmarkServerToken = process.env.POSTMARK_SERVER_TOKEN ?? "";

console.log({ postmarkServerToken });
export const postmarkClient = new postMark.ServerClient(postmarkServerToken);
