import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { zipSync } from 'fflate';
await mkdir('dist', { recursive: true });
await build({ entryPoints: ['server/index.ts'], bundle: true, platform: 'node', target: 'node22', format: 'cjs', outfile: 'dist/index.cjs', sourcemap: false });
await writeFile('dist/api.zip', zipSync({ 'index.cjs': new Uint8Array(await readFile('dist/index.cjs')) }));
console.log('Built isolated portfolio API');
