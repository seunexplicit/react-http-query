import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import packageJson from './package.json' assert { type: 'json' };

export default {
    external: [],
    input: 'src/lib/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [resolve(), commonjs(), typescript(), terser()]
};