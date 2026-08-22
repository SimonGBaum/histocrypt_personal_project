import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost",
    supportFile: false,
    video: false,
    viewportWidth: 1024,
    viewportHeight: 768,
  },
});
