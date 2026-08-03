import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/api",

  use: {
    baseURL: process.env.BASE_URL,
  },

  reporter: [["html"], ["list"]],
});