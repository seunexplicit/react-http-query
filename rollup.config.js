import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

import packageJson from './package.json' assert { type: 'json' };

const inputFile = 'lib/index.ts';
const babelPlugin = babel({
    babelHelpers: 'bundled',
    exclude: /node_modules/,
    extensions: ['.ts', '.tsx'],
});

/**
 * Get rollup config for different build type.
 *
 * @param {'esm' | 'cjs'} configType The configuration type.
 * @returns
 */
const getRollupConfig = (configType) => ({
    external: ['react', 'react-dom'],
    input: inputFile,
    output: {
        file: configType === 'cjs' ? packageJson.main : packageJson.module,
        format: configType,
        sourcemap: true,
        ...(configType === 'cjs' && { exports: 'named' }),
    },
    plugins: [resolve({ extensions: ['.ts', '.tsx'] }), babelPlugin, commonjs(), terser()],
});

export default [
    getRollupConfig('cjs'),
    getRollupConfig('esm'),
    {
        input: inputFile,
        output: [{ file: 'dist/index.js', format: 'es' }],
        plugins: [typescript()],
    },
];
