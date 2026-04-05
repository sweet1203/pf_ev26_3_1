/**
 * dataset/grade2, grade3 → public/dataset/ (Vite 정적 제공용)
 */
import { cpSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const pub = join(root, 'public', 'dataset');

mkdirSync(pub, { recursive: true });
cpSync(join(root, 'dataset', 'grade2'), join(pub, 'grade2'), { recursive: true });
cpSync(join(root, 'dataset', 'grade3'), join(pub, 'grade3'), { recursive: true });
console.log('synced dataset/grade2, grade3 → public/dataset/');
