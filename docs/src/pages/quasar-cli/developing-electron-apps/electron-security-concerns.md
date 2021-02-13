---
title: Electron Security Concerns
desc: The things you should know about security in a Quasar desktop app.
---
If you are not vigilant when building Electron apps, you will probably be placing the users of your app in tangible digital danger. Things like XSS (Cross Site Scripting) and remote code execution can literally enable attackers to get deep access to the data in your app - and potentially even the underlying operating system.

Especially when working "in the open", i.e. as an open-source project, you will definitely want to consider hardening your application with code-signing and integrity checking. (See "Tips" section)

::: danger
Under no circumstances should you load and execute remote code. Instead, use only local files (packaged together with your application) to execute Node.js code in your main thread and/or preload script.
:::

## Checklist: Security Recommendations
The Electron team itself makes the following recommendations:

1.  Make sure that you leave `webPreferences` > `contextIsolation` set to `true`. Use the [preload script](/quasar-cli/developing-electron-apps/electron-preload-script) to inject only must-have APIs to the renderer thread.
2.  If you must load remote content and cannot work around that, then [only load secure content](https://electronjs.org/docs/tutorial/security#1-only-load-secure-content)
3.  [Use  `ses.setPermissionRequestHandler()`  in all sessions that load remote content](https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content)
4.  [Do not disable  `webSecurity`](https://electronjs.org/docs/tutorial/security#5-do-not-disable-websecurity)
5.  [Do not set  `allowRunningInsecureContent`  to  `true`](https://electronjs.org/docs/tutorial/security#7-do-not-set-allowrunninginsecurecontent-to-true)
6.  [Do not enable experimental features](https://electronjs.org/docs/tutorial/security#8-do-not-enable-experimental-features)
7.  [Do not use  `enableBlinkFeatures`](https://electronjs.org/docs/tutorial/security#9-do-not-use-enableblinkfeatures)
8.  [`<webview>`: Do not use `allowpopups`](https://electronjs.org/docs/tutorial/security#10-do-not-use-allowpopups)
9.  [`<webview>`: Verify options and params](https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation)
10.  [Disable or limit navigation](https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation)
11.  [Disable or limit creation of new windows](https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows)

Except for items 3 and 4 above, Electron will put a warning in the dev console if one of the these issues have been detected.


## Tips and Tricks

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

#### Disable developer tools in production

You probably don't want rogue hoody-wearing menaces to be executing something like this in the console of your app:

```js
window.location='https://evilsite.com/looks-just-like-your-app'
```

The key-combination <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>I</kbd> (or <kbd>ALT</kbd>+<kbd>CMD</kbd>+<kbd>I</kbd> on Mac) will open the dev tools and enable inspection of the application. It will even enable some degree of modification. Prevent the simple `evil maid` attack by catching these keypresses and `return false`.

#### Publish checksums
When you have built your binary blobs and want to publish them e.g. on GitHub, use `shasum` and post these results somewhere prominent (like on the GitHub release page for your project) and potentially on a public blockchain, such as [Steem](https://steemworld.org/@quasarframework).

```bash
$ shasum -a 256 myApp-v1.0.0_darwin-x64.dmg
40ed03e0fb3c422e554c7e75d41ba71405a4a49d560b1bf92a00ea6f5cbd8daa myApp-v1.0.0_darwin-x64.dmg
```

#### Sign the builds
Although not a hard requirement for sharing your app, signing code is a best practice - and it is required by both the MacOS and Windows stores. Read more about it at this [official Electron tutorial](https://electronjs.org/docs/tutorial/code-signing).

#### Use SNYK
[Snyk.io](https://snyk.io) is a service, CLI and even GitHub integration bot that tracks vulnerabilities in node modules by comparing the dependencies in your package.json with its list of compromised modules. In many cases their service can recommend minimum update versions or even provide modules that they themselves have patched. They also undertake research and vulnerability disclosure. For an example of something that should scare the socks off of you if you are doing anything with compressed files (zip, tar, etc.) check out their [writeup](https://snyk.io/research/zip-slip-vulnerability) and [list of affected software](https://github.com/snyk/zip-slip-vulnerability).


#### For the truly paranoid
Use a dedicated physical desktop machine for each platform target. If you have to keep this device online, make sure the OS is always updated, permits zero inbound connections from the internet / bluetooth (especially for shell / ssh) and run constant virus and rootkit checks.

Permit only GPG-signed commits to be merged and require at least two team members (who did not make the PR) to review and approve the commit.

Reconsider your node package management system:
- use a private npm registry (like [JFrog](https://jfrog.com/))
- fix your packages to specific versions known to work
- use pnpm
- audit each and every single module and its dependencies

#### Pay to get hacked
Somebody smart might have hacked your project (or an underlying library). If you are making money with this app, consider getting a [Hacker One](https://hackerone.com) account and running a constant bounty award. At least you'll be able to convince the hacker to be ethical and NOT sell the exploit to your competitor.

#### Get help
You may feel overwhelmed, because the awesomeness of Electron brings with it a great many headaches that you never wanted to think about. If this is the case, consider [reaching out](mailto:razvan.stoenescu@gmail.com) and getting expert support for the review, audit and hardening of your app by the team of seasoned devs that brought you the Quasar Framework.

<q-separator class="q-mt-xl" />

> Parts of this page have been taken from the official [Electron Security Guide](https://electronjs.org/docs/tutorial/security).
