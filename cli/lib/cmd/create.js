console.log(`
 · For scaffolding an official Quasar project please use this instead:

   yarn create quasar
     (or)
   npm init quasar

 · For scaffolding a custom starter kit please use this instead:

   yarn global add @quasar/legacy-create
     (or)
   npm install -g @quasar/legacy-create

     ...and then:
   quasar-legacy-create <project-name> <kit-name> [--branch <version-name>]
`)
process.exit(0)
