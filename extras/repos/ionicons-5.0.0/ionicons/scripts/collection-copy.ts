import fs from 'fs-extra';
import { join } from 'path';


async function collectionCopy(rootDir: string) {
  // move optimized svgs to correct collection location
  const optimizedSrc = join(rootDir, 'dist', 'ionicons', 'svg');
  const collectionDest = join(rootDir, 'dist', 'collection', 'components', 'icon', 'svg');
  await fs.copy(optimizedSrc, collectionDest);

  // we don't to copy the src svgs to collection
  await fs.remove(join(rootDir, 'dist', 'collection', 'svg'));
}

collectionCopy(join(__dirname, '..'));