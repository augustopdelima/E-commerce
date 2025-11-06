import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    poolOptions: {
      threads: { execArgv: ["--env-file=.env.test"] },
      forks: { execArgv: ["--env-file=.env.test"] },
    },
  },
});
