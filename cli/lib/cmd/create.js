console.log(`
 · For scaffolding an official Quasar project please use this instead:

   npm init quasar
     (or)
   yarn create quasar
     (or)
   pnpm create quasar
     (or)
   bun create quasar

 · For scaffolding a custom starter kit please use this instead:

   npm install -g @quasar/legacy-create
     (or)
   yarn global add @quasar/legacy-create
     (or)
   pnpm add -g @quasar/legacy-create
     (or)
   bun install -g @quasar/legacy-create

     ...and then:
   quasar-legacy-create <project-name> <kit-name> [--branch <version-name>]
`)
process.exit(0)
