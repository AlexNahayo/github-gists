/***
 * Deletes a test gist using the provided gist client and gist ID.
 * @param {GistClient} gistClient - The Gist client instance to use for deletion.
 * @param {string} gistId - The ID of the gist to delete.
 */
export async function deleteTestGist(gistClient, gistId) {

    if (!gistId) {
        return;
    }

    const response = await gistClient.delete(gistId);

    if (response.status() !== 204) {
        console.warn(
            `Failed cleanup for gist ${gistId}. Status: ${response.status()}`
        );
    }

}