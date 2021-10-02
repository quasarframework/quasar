const { resolve } = require('path');
const { readdir } = require('fs').promises;
async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

export async function fastifyStaticInit(app, resolveUrlPath, publicFolder, serveStatic) {
  // fastify can only have one handler per path
  // so we have to scan all the static folders
  // and create a separate handler for each file
  // in order to be able to serve vue-rendered
  // pages later
  for await (const f of getFiles(publicFolder)) {
    const path = f.substr(publicFolder.length + 1)
    app.get(resolveUrlPath('/' + path), serveStatic(path))
  }
}
