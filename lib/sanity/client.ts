import { type ClientConfig, createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";
const token = process.env.SANITY_AUTH_TOKEN;

const config: ClientConfig = {
    projectId,
    dataset: "production",
    token,
    apiVersion,
    useCdn: false,
};

const client = createClient(config);

export default client;
