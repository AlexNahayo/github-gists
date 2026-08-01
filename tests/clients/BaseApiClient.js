/**
 * Base API Client
 *
 * Provides reusable HTTP methods and common configuration
 * for API clients in the test framework.
 *
 * Centralises:
 * - Authentication headers
 * - GitHub API version headers
 * - GET, POST, PATCH, DELETE request handling
 *
 * Specific API clients (e.g. GistClient) extend this class
 * to interact with individual endpoints.
 */
export class BaseApiClient {
    constructor(request, token) {
        this.request = request;
        this.token = token;
    }

    get headers() {
        return {
            Authorization: `Bearer ${this.token}`,
            Accept: "application/vnd.github+json",
            'X-GitHub-Api-Version': '2026-03-10'
        };
    }

    async get(endpoint, options = {}) {

        return await this.request.get(endpoint, {
            ...options,
            headers: {
                ...this.headers,
                ...(options.headers ?? {})
            }
        });

    }

    async post(url, data) {
        return await this.request.post(url, {
            headers: this.headers,
            data,
        });
    }

    async patch(url, data) {
        return await this.request.patch(url, {
            headers: this.headers,
            data,
        });
    }

    async delete(url) {
        return await this.request.delete(url, {
            headers: this.headers,
        });
    }
}