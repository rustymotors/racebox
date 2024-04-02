import { defineConfig } from "vitest/config";

const x=process.env.PWD.split('/');
const moduleName = `rm-${x[x.length-1]}`;

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
