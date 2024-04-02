import { defineConfig } from "vitest/config";

const x=process.env.PWD ?? __dirname;
const y = x.split('/');
const moduleName = `rm-${y[y.length-1]}`;

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            all: true,
            reporter: ["lcov", "text", "cobertura"],
        },
        reporters: ["junit", "default", "hanging-process"],
        outputFile: `${moduleName}-test-results.xml`,
    },
});
