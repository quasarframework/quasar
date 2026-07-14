---
title: Electron Security Concerns
desc: (@quasar/app-vite) The things you should know about security in a Quasar desktop app.
---

If you are not vigilant when building Electron apps, you will probably be placing the users of your app in tangible digital danger. Things like XSS (Cross Site Scripting) and remote code execution can literally enable attackers to get deep access to the data in your app - and potentially even the underlying operating system.

Especially when working "in the open", i.e. as an open-source project, you will definitely want to consider hardening your application with code-signing and integrity checking. (See "Tips" section)

::: danger
Under no circumstances should you load and execute remote code. Instead, use only local files (packaged together with your application) to execute Node.js code in your main thread and/or preload script.
:::

## Checklist: Security Recommendations

Follow Electron's complete [security checklist](https://www.electronjs.org/docs/latest/tutorial/security). In particular:

1. Keep Electron current so your application receives Chromium, Node.js, and Electron security fixes.
2. Load packaged local content whenever possible. If remote content is unavoidable, use secure transport and never enable Node.js integration for it.
3. Keep `contextIsolation` and renderer sandboxing enabled. Use a [preload script](/quasar-cli-vite/developing-electron-apps/electron-preload-script) to expose narrow, task-specific functions rather than raw Electron or Node.js APIs.
4. Define a restrictive Content Security Policy. Do not disable `webSecurity`, enable `allowRunningInsecureContent`, or enable unnecessary experimental/Blink features.
5. Handle permission requests explicitly and deny permissions your application does not require.
6. Restrict navigation and new-window creation. Validate URLs before passing them to `shell.openExternal`.
7. Validate the sender of every IPC message before performing privileged work. Never expose unrestricted `ipcRenderer.send`, `ipcRenderer.invoke`, filesystem, shell, or process APIs to renderer code.
8. Avoid `<webview>` where possible. If it is required, verify its options and do not enable popups.
9. Prefer a custom protocol over `file://` for packaged content when your application requires a stronger origin model.
10. Review Electron fuses before distribution to disable capabilities your application does not use.

## Tips and Tricks

#### Using CSP (Content Security Policy)

Your `/index.html` file should contain a CSP meta tag in your `<head>`. Example:

```html /index.html
<head>
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';<% if (ctx.dev) { %> connect-src 'self' ws://localhost:*; worker-src 'self' blob:;<% } %>"
  />
</head>
```

#### Communication Protocols

You should know this by now, but if you are not using **https** / **sftp** / **wss** then the app's communications with the outside world can be very easily tampered with. Whatever you are building, please use a secure protocol everywhere.

#### Filesystem Access

Having read & write permissions to the filesystem is the holy grail for penetration testers, and if your app enables this type of interaction, consider using IPC and multiple windows (with varying permissions) in order to minimize the attack surface.

#### Encryption

If the user of your application has secrets like wallet addresses, personal information or some other kind of trade secrets, keep that information encrypted when at rest, un-encrypt it in-memory only when it is needed and make sure to overwrite / destroy the object in memory when you are done with it. But no matter how you approach this, follow these four rules:

1. use strong crypto (i.e. collision resistant and not md5)
2. do not invent a novel type of encryption
3. follow the implementation instructions explicitly
4. think about the user-experience

#### Publish checksums

When you publish application binaries, publish their cryptographic checksums through a trusted channel so users can verify downloaded files.

```
$ shasum -a 256 myApp-v1.0.0_darwin-x64.dmg
40ed03e0fb3c422e554c7e75d41ba71405a4a49d560b1bf92a00ea6f5cbd8daa myApp-v1.0.0_darwin-x64.dmg
```

#### Sign the builds

Although not a hard requirement for sharing your app, signing code is a best practice - and it is required by both the MacOS and Windows stores. Read more about it at this [official Electron tutorial](https://electronjs.org/docs/tutorial/code-signing).

#### Audit dependencies

Use your package manager's audit tooling and an automated dependency scanner. Review reported vulnerabilities in the context of your application, update affected packages, and keep the lockfile under version control.

#### Harden the build environment

Use a dedicated physical desktop machine for each platform target. If you have to keep this device online, make sure the OS is always updated, permits zero inbound connections from the internet / bluetooth (especially for shell / ssh) and run constant virus and rootkit checks.

Permit only GPG-signed commits to be merged and require at least two team members (who did not make the PR) to review and approve the commit.

Protect release credentials, pin dependencies through the lockfile, review dependency changes, and produce releases from a controlled build environment.

#### Pay to get hacked

Somebody smart might have hacked your project (or an underlying library). If you are making money with this app, consider getting a [Hacker One](https://hackerone.com) account and running a constant bounty award. At least you'll be able to convince the hacker to be ethical and NOT sell the exploit to your competitor.

#### Get help

You may feel overwhelmed, because the awesomeness of Electron brings with it a great many headaches that you never wanted to think about. If this is the case, consider [reaching out](mailto:razvan.stoenescu@gmail.com) and getting expert support for the review, audit and hardening of your app by the team of seasoned devs that brought you the Quasar Framework.

<q-separator class="q-mt-xl" />

See the official [Electron Security Guide](https://www.electronjs.org/docs/latest/tutorial/security) for the complete checklist and implementation examples.
