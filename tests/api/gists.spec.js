import { test, expect, gistPayload } from "../fixtures/gistFixtures.js";
import { validateSchema, validateCommonHeaders } from "../helpers/validators.js";
import { deleteTestGist } from "../helpers/gistHelper.js";
import { gistSchema, getGistsSchema } from "../schemas/gistSchema.js";

test.describe("POST /gists - Create gist", () => {

    test("creates private gist successfully", async ({ gistClient }) => {

        let gistId;

        try {

            const payload = gistPayload.createPrivateGist();

            const response = await gistClient.create(payload);

            expect(response.status()).toBe(201);

            validateCommonHeaders(response);

            const gist = await response.json();

            gistId = gist.id;

            expect(validateSchema(gist, gistSchema)).toBeTruthy();

            expect(gist.description).toBe(payload.description);
            expect(gist.public).toBe(false);
            expect(gist.files).toHaveProperty(["test.txt"]);

        } finally {
            await deleteTestGist(gistClient, gistId);
        }

    });

    test("creates public gist successfully", async ({ gistClient }) => {

        let gistId;

        try {

            const payload = gistPayload.createPublicGist();

            const response = await gistClient.create(payload);

            expect(response.status()).toBe(201);

            validateCommonHeaders(response);

            const gist = await response.json();

            gistId = gist.id;

            expect(validateSchema(gist, gistSchema)).toBeTruthy();

            expect(gist.public).toBe(true);

            expect(gist.files).toHaveProperty(["README.md"]);

            expect(gist.files).toHaveProperty(["test.js"]);

            expect(gist.files).toHaveProperty(["config.json"]);

        } finally {
            await deleteTestGist(gistClient, gistId);
        }

    });

    test("rejects creating gist without authentication token", async ({ unauthenticatedGistClient }) => {

        const response = await unauthenticatedGistClient.create(
            gistPayload.createPrivateGist()
        );

        expect(response.status()).toBe(401);
    });

    test("rejects invalid gist payload", async ({ gistClient }) => {

        const response = await gistClient.create({
            description: "",
            public: false,
            files: {}
        });

        expect(response.status()).toBe(422);
    });
});

test.describe("GET /gists - Retrieve gists", () => {

    test("retrieves authenticated user's gists successfully", async ({ gistClient }) => {

        const createdGistIds = [];

        try {

            for (let i = 1; i <= 3; i++) {

                const response = await gistClient.create(
                    gistPayload.createPrivateGist()
                );

                expect(response.status()).toBe(201);

                const gist = await response.json();

                createdGistIds.push(gist.id);
            }

            const response = await gistClient.getGists();

            expect(response.status()).toBe(200);

            validateCommonHeaders(response);

            const gists = await response.json();

            expect(validateSchema(gists, getGistsSchema)).toBeTruthy();

            expect(gists.length).toBeGreaterThanOrEqual(3);

        } finally {
            for (const id of createdGistIds) {
                await deleteTestGist(gistClient, id);
            }
        }

    });

    test("returns 304 when gists have not changed", async ({ gistClient }) => {

        const firstResponse = await gistClient.getGists();

        expect(firstResponse.status()).toBe(200);

        const etag = firstResponse.headers()["etag"];

        expect(etag).toBeTruthy();

        // Second request using the ETag
        const secondResponse = await gistClient.getGists(
            {},
            {
                "If-None-Match": etag
            }
        );

        expect(secondResponse.status()).toBe(304);
        expect(secondResponse.headers()["etag"]).toBeTruthy();
    });
});

test.describe("GET /gists/{id} - Retrieve single gist", () => {

    test("retrieves gist by ID successfully", async ({ gistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            const created = await createResponse.json();

            gistId = created.id;

            const response = await gistClient.getGist(gistId);

            expect(response.status()).toBe(200);

            validateCommonHeaders(response);

            const gist = await response.json();

            expect(validateSchema(gist, gistSchema)).toBeTruthy();

            expect(gist.id).toBe(gistId);

        } finally {
            await deleteTestGist(gistClient, gistId);
        }

    });

    test("returns 304 when gist has not changed", async ({ gistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            const created = await createResponse.json();

            gistId = created.id;

            const firstResponse = await gistClient.getGist(gistId);

            expect(firstResponse.status()).toBe(200);

            const etag = firstResponse.headers()["etag"];

            expect(etag).toBeTruthy();

            const secondResponse = await gistClient.getGist(gistId,
                {
                    "If-None-Match": etag
                }
            );

            expect(secondResponse.status()).toBe(304);
            expect(secondResponse.headers()["etag"]).toBeTruthy();

        } finally {
            await deleteTestGist(gistClient, gistId);
        }

    });

    test("rejects retrieving gist without valid authentication", async ({ gistClient, invalidAuthGistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            const created = await createResponse.json();

            gistId = created.id;

            const response = await invalidAuthGistClient.getGist(gistId);

            expect(response.status()).toBe(401);

        } finally {
            await deleteTestGist(gistClient, gistId);
        }

    });

    test("returns 404 for unknown gist ID", async ({ gistClient }) => {

        const response = await gistClient.getGist("invalid-gist-id");

        expect(response.status()).toBe(404);
    });

});

test.describe("PATCH /gists/{id} - Update gist", () => {

    test("updates gist description successfully", async ({ gistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            const created = await createResponse.json();

            gistId = created.id;

            const response = await gistClient.update(
                gistId,
                {
                    description: "Updated Playwright gist"
                }
            );

            expect(response.status()).toBe(200);

            validateCommonHeaders(response);

            const updated = await response.json();

            expect(validateSchema(updated, gistSchema)).toBeTruthy();

            expect(updated.description).toBe("Updated Playwright gist");

        } finally {
            await deleteTestGist(gistClient, gistId);
        }

    });

    test("rejects updating unknown gist ID", async ({ gistClient }) => {

        const response = await gistClient.update(
            "invalid-gist-id",
            {
                description: "Updated description"
            }
        );

        expect(response.status()).toBe(404);
    });

    test("rejects updating gist without authentication", async ({ gistClient, unauthenticatedGistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            expect(createResponse.status()).toBe(201);

            const gist = await createResponse.json();

            gistId = gist.id;

            const response = await unauthenticatedGistClient.update(gistId, {
                description: "Updated description"
            });

            expect(response.status()).toBe(401);

        } finally {
            await deleteTestGist(gistClient, gistId);
        }
    });

    test("rejects invalid update payload", async ({ gistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            expect(createResponse.status()).toBe(201);

            const created = await createResponse.json();

            gistId = created.id;

            // Invalid payload
            const response = await gistClient.update(
                gistId,
                {
                    files: {
                        "test.txt": null
                    }
                }
            );

            expect(response.status()).toBe(422);

        } finally {
            await deleteTestGist(gistClient, gistId);
        }
    });

});

test.describe("DELETE /gists/{id} - Delete gist", () => {

    test("deletes gist successfully", async ({ gistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            expect(createResponse.status()).toBe(201);

            const gist = await createResponse.json();

            gistId = gist.id;

            const response = await gistClient.delete(gistId);

            expect(response.status()).toBe(204);
            
            gistId = null;

        } finally {
            await deleteTestGist(gistClient, gistId);
        }

    });

    test("rejects deleting gist without authentication", async ({ gistClient, unauthenticatedGistClient }) => {

        let gistId;

        try {

            const createResponse = await gistClient.create(
                gistPayload.createPrivateGist()
            );

            expect(createResponse.status()).toBe(201);

            const gist = await createResponse.json();

            gistId = gist.id;

            const response = await unauthenticatedGistClient.delete(gistId);

            expect(response.status()).toBe(401);

        } finally {
            await deleteTestGist(gistClient, gistId);
        }
    });

    test("rejects deleting unknown gist ID", async ({ gistClient }) => {
        const response = await gistClient.delete("invalid-gist-id");
        expect(response.status()).toBe(404);
    });
});

