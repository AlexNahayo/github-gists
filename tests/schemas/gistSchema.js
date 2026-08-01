/**
 * GitHub Gist Response Schema
 *
 * Validates the structure of a Gist response.
 *
 * Ensures the API contract remains stable:
 * - Required fields exist
 * - Data types are correct
 * - Nested objects follow expected structure
 */

export const gistSchema = {
    type: "object",
    required: [
        "id",
        "description",
        "public",
        "files",
        "owner",
        "created_at",
        "updated_at"
    ],
    properties: {
        id: { type: "string" },
        description: { type: ["string", "null"] },
        public: { type: "boolean" },
        files: { type: "object" },
        owner: { type: "object" },
        created_at: { type: "string" },
        updated_at: { type: "string" }
    }
};

export const getGistsSchema = {
    type: "array",
    items: gistSchema
};