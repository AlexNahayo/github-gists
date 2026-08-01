import { test as base, expect as playwrightExpect } from "@playwright/test";

import { GistClient } from "../clients/GistClient.js";
import { GITHUB_TOKEN } from "../helpers/auth.js";


/**
 * Creates a reusable authenticated/unathenticated Gist client 
 */
export const test = base.extend({

    gistClient: async ({ request }, use) => {
        const client = new GistClient(request, GITHUB_TOKEN);
        await use(client);
    },
    
});

export const expect = playwrightExpect;


/**
 * Provides reusable Gist payloads.
 */
export const gistPayload = {

    createPrivateGist(description = "Playwright test gist") {
        return {
            description,
            public: false,
            files: {
                "test.txt": {
                    content: "Created using Playwright"
                }
            }
        };

    },

    createPublicGist() {
        return {
            description: "Multi file Playwright gist",
            public: true,
            files: {
                "README.md": {
                    content: "# Playwright API Testing"
                },
                "test.js": {
                    content: "console.log('test');"
                },
                "config.json": {
                    content: "{\"env\":\"test\"}"
                }
            }
        };
    }

};