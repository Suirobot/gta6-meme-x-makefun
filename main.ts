// GTA 6 meme entry for make.fun's "Post a GTA 6 meme on X" bounty (Node 22, standard library only).
// The entry is the X post itself: my meme of a gamer who aged thirteen years waiting for GTA 6,
// stuck at a 97% download of 187 GB, with make.fun's ghost in the picture and the bounty pitch,
// the @makefunai tag and my play code in the text. The post is live at the address in POST.json.
// This program copies POST.json from the repository root to /output/POST.json, where the gate
// reads it and the house fetches the post from X.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly rather than hand the gate a file that is not the post's address.
const post = JSON.parse(readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')) as { url?: unknown };
if (typeof post.url !== 'string' || !/^https:\/\/(www\.|mobile\.)?(x|twitter)\.com\/[^/]+\/status\/\d+$/.test(post.url)) {
  console.error('POST.json does not hold an X post address');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));

// Read the copy back and compare: the gate reads /output/POST.json, so a silent short write
// would hand it a broken file. Verify the bytes match and say which post was handed in.
const handed = readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8');
if (handed !== readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')) {
  console.error('POST.json copy does not match the repository file');
  process.exit(1);
}
console.log(`handed in: ${post.url}`);
