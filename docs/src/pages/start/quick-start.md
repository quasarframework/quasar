---
tiêu đề: Bắt đầu nhanh
desc: Thiết lập và phát triển ứng dụng Quasar trong vòng chưa đầy 3 phút.
---

Chỉ cần hai bước đơn giản và trong vài phút, bạn sẽ sẵn sàng và chạy với ứng dụng Vue chính thức, được xây dựng bằng các phương pháp thực hành tốt nhất hiện đại thông qua CLI của Quasar và cũng sẵn sàng với thư viện giao diện người dùng mạnh mẽ của Quasar.

::: mẹo
Điều kiện tiên quyếtNếu bạn là nhà phát triển Vue nâng cao hơn, chúng tôi mời bạn bắt đầu bằng cáchquyết định giữa tất cả các hương vị Quasar](/start/pick-quasar-hương vị).
:::

##Điều kiện tiên quyết

Phiên bản LTS Node.jsĐảm bảo rằng bạn có Node.js >=22 (hoặc bất kỳ phiên bản mới hơn nàoPhiên bản LTS Node.js**) và NPM v6 hoặc Yarn v1 (cổ điển) hoặc PNPM v8 hoặc Bun được cài đặt trên máy của bạn. được coi là thử nghiệmđược coi là thử nghiệm](https://nodejs.org/en/about/previous-releases).

## Step 1: Create a Project

Navigate to the folder above where you want your project to be. Quasar will later prompt you for the name of the project folder and create that folder within this.

Enter the following command:

```tabs
<<| bash Yarn |>>
$ yarn create quasar
<<| bash NPM |>>
$ npm init quasar@latest
<<| bash PNPM |>>
$ pnpm create quasar@latest
<<| bash Bun |>>
$ bun create quasar@latest
```

As the command above runs, you'll be prompted with some options. Depending on your needs, you can select the CLI type (Vite or Webpack) and you can add things like TypeScript support or a different CSS preprocessor. If you are unsure about any of the options, just take the defaults (hit enter) and you'll be good to go. You can change the options, except for the CLI type, later if you wish.

### Optional - Install the Global CLI

For doing more with Quasar, you should also install the global CLI. With it you can directly run Quasar commands in the terminal, run a local http server for testing or do upgrades on your project.

```tabs
<<| bash Yarn |>>
$ yarn global add @quasar/cli
<<| bash NPM |>>
$ npm i -g @quasar/cli
<<| bash PNPM |>>
$ pnpm add -g @quasar/cli
<<| bash Bun |>>
$ bun install -g @quasar/cli
```

## Step 2: Start developing

For the second and last step, navigate into the newly created project folder and run the Quasar CLI command to start the dev server.

```tabs
<<| bash Yarn |>>
# if you have the global CLI:
$ quasar dev

# otherwise:

$ yarn run dev
# to run a local Quasar CLI command:
$ yarn quasar dev
<<| bash NPM |>>
# if you have the global CLI:
$ quasar dev

# otherwise:

$ npm run dev
# to run a local Quasar CLI command:
$ npx quasar dev
<<| bash PNPM |>>
# if you have the global CLI:
$ quasar dev

# otherwise:

$ pnpm run dev
# to run a local Quasar CLI command:
$ pnpm quasar dev
<<| bash Bun |>>
# if you have the global CLI:
$ quasar dev

# otherwise:

$ bun run dev
# to run a local Quasar CLI command:
$ bun quasar dev
```

You'll see the dev server compiling your new application and once it is finished, your new app should open up in your browser. That's it! You can now develop your app with your favorite IDE / Code Editor.

## Now What?

If you are new to Quasar and a...

**(Beginner Vue) JavaScript Dev** - We highly recommend [learning Vue](/start/how-to-use-vue).

**Intermediate Vue Dev** - We recommend getting accustomed to [Quasar's Directory Structure](/quasar-cli/directory-structure) and its different build modes, [starting with SSR](/quasar-cli/developing-ssr/introduction) (the project you built is an SPA).

**Advanced Vue Dev** - You might want to use Quasar in different scenarios outside of Quasar's own CLI, then check out the different [Quasar Flavours](/start/pick-quasar-flavour). Or, if you wish to stick with the Quasar CLI, check out the different build modes, [starting with SSR](/quasar-cli/developing-ssr/introduction) and please be sure not to miss out on [App Extensions](/app-extensions/introduction).
