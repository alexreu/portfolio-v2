import * as postMark from "postmark";

const postmarkServerToken = process.env.POSTMARK_SERVER_TOKEN ?? "";

export const postmarkClient = new postMark.ServerClient(postmarkServerToken);
