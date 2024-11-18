import { defineConfig, Options } from "tsup";

const environments = ["development", "production"] as const;
const platforms = ["browser", "neutral", "node"] as const;

// Helper to create the output extension
const getOutExtension = (
  platform: (typeof platforms)[number],
  env: (typeof environments)[number]
) => ({
  js: `${platform === "neutral" ? "" : `.${platform}`}${env === "development" ? ".development" : ""}.js`,
});

// Create all possible combinations
const configs: Options[] = environments.flatMap((env) =>
  platforms.flatMap((platform) => ({
    entry: ["src/index.ts"],
    format: ["esm"],
    platform,
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    outExtension: () => getOutExtension(platform, env),
    define: {
      "process.env.NODE_ENV": JSON.stringify(env),
      "process.env.IS_BROWSER": JSON.stringify(platform === "browser"),
    },
    esbuildOptions(options) {
      options.conditions = [env];
    },
  }))
);

export default defineConfig(configs);
