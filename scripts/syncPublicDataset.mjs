/**
 * dataset/practice|assessment/grade2, grade3 → public/dataset/ (Vite 정적 제공용)
 */
import { cpSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const pub = join(root, 'public', 'dataset');
const ds = join(root, 'dataset');

mkdirSync(join(pub, 'practice', 'grade2'), { recursive: true });
mkdirSync(join(pub, 'practice', 'grade3'), { recursive: true });
mkdirSync(join(pub, 'assessment', 'grade2'), { recursive: true });
mkdirSync(join(pub, 'assessment', 'grade3'), { recursive: true });

cpSync(join(ds, 'practice', 'grade2'), join(pub, 'practice', 'grade2'), { recursive: true });
cpSync(join(ds, 'practice', 'grade3'), join(pub, 'practice', 'grade3'), { recursive: true });
cpSync(join(ds, 'assessment', 'grade2'), join(pub, 'assessment', 'grade2'), { recursive: true });
cpSync(join(ds, 'assessment', 'grade3'), join(pub, 'assessment', 'grade3'), { recursive: true });
console.log('synced dataset/practice|assessment → public/dataset/');
