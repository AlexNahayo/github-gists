import Ajv from "ajv";
import { expect } from "@playwright/test";

/**
 * Validates the given data against the provided JSON schema.
 * @param {Object} data - The data to validate.
 * @param {Object} schema - The JSON schema to validate against.
 * @returns {boolean} - Returns true if the data is valid, false otherwise.
 */
export function validateSchema(data, schema) {
    const ajv = new Ajv({
        allErrors: true
    });

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
        console.log(validate.errors);
    }
    return valid;
}

/**
 * Validates API response headers.
 * @param {Object} response - The response object which requires validation
 * @returns {boolean} - Returns true if the response is valid, false otherwise.
 */
export function validateCommonHeaders(response) {
    const headers = response.headers();

    expect(headers["content-type"])
        .toContain("application/json");

    expect(headers["x-github-media-type"])
        .toBeTruthy();
}

