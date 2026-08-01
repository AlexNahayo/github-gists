import dotenv from "dotenv";

dotenv.config();

export const BASE_URL = process.env.BASE_URL;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;


console.log(process.env.GITHUB_TOKEN);

if (!GITHUB_TOKEN) {
    throw new Error(
        "GITHUB_TOKEN is missing. Please add it to your .env file."
    );
}

