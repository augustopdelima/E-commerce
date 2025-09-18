import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    poolOptions: {
      threads: { execArgv: ["--env-file=.env"] },
      forks: { execArgv: ["--env-file=.env"] },
    },
  },
});
