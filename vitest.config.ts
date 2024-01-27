import { defineConfig as defineViteConfig } from 'vite';
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import { defineConfig, mergeConfig } from 'vitest/config';

const viteConfig = defineViteConfig({
    plugins: [
        wasm(),
        topLevelAwait()
    ]
});

export default mergeConfig(viteConfig, defineConfig({
    test: {
        testTimeout: 400000,
        exclude: ['packages/template/*'],
    },
}))