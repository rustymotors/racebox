import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            all: true,
            reporter: ["lcov", "text", "cobertura"],
        },
        reporters: ["junit", "default", "hanging-process"],
        outputFile: "racebox.junit.xml",
    },
});
