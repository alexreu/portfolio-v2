import * as postMark from "postmark";

const postmarkServerToken = process.env.POSTMARK_SERVER_TOKEN;

if (!postmarkServerToken) {
    throw new Error("POSTMARK_SERVER_TOKEN environment variable is not set");
}

export const postmarkClient = new postMark.ServerClient(postmarkServerToken);
