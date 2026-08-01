/**
 * Gist API Client
 *
 * Provides wrapper methods for interacting with GitHub Gist endpoints.
 *
 * Extends BaseApiClient to reuse:
 * - Authentication handling
 * - Common GitHub headers
 * - HTTP request methods
 *
 * Keeps API tests clean by separating endpoint interaction
 * from test logic.
 */

import { BaseApiClient } from "./BaseApiClient.js";

export class GistClient extends BaseApiClient {

    /**
     * Retrieves all gists for the authenticated user.
     *
     * @param {Object} params - Optional query parameters
     * @param {object} headers - Optional headers parameters
     */
    async getGists(params = {}, headers = {}) {

        return await this.get("/gists", {
            params,
            headers
        });

    }

    /**
     * Retrieves a specific gist by ID.
     *
     * @param {string} id - Gist identifier
     * @param {Object} headers - Optional request headers
     */
    async getGist(id, headers = {}) {

        return await this.get(`/gists/${id}`, {
            headers
        });

    }

    /**
     * Creates a new gist.
     *
     * @param {object} data - Gist payload
     */
    async create(data) {
        return await this.post("/gists", data);
    }

    /**
     * Updates an existing gist.
     *
     * @param {string} id - Gist identifier
     * @param {object} data - Updated gist payload
     */
    async update(id, data) {
        return await this.patch(`/gists/${id}`, data);
    }

    /**
     * Deletes an existing gist.
     *
     * @param {string} id - Gist identifier
     */
    async delete(id) {
        return await super.delete(`/gists/${id}`);
    }
}