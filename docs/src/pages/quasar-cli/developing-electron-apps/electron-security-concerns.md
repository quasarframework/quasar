---
title: Electron Security Concerns
---
If you are not vigilant when building Electron apps, you will probably be placing the users of your app in tangible digital danger. Things like XSS (Cross Site Scripting) and remote code execution can literally enable attackers to get deep access to the data in your app - and potentially even the underlying operating system.

Especially when working "in the open", i.e. as an open-source project, you will definitely want to consider hardening your application with code-signing and integrity checking. (See [the tips](/quasar-cli/developing-electron-apps/electron-security-concerns#Tips-and-Tricks) below.)

::: danger
Under no circumstances should you load and execute remote code with Node.js integration enabled. Instead, use only local files (packaged together with your application) to execute Node.js code. To display remote content, use the `<webview>` tag and make sure to disable the nodeIntegration.
:::

## Checklist: Security Recommendations
The Electron team itself makes the following recommendations:
 
1.  [Only load secure content](https://electronjs.org/docs/tutorial/security#1-only-load-secure-content)
2.  [Disable the Node.js integration in all renderers that display remote content](https://electronjs.org/docs/tutorial/security#2-disable-nodejs-integration-for-remote-content)
3.  [Enable context isolation in all renderers that display remote content](https://electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content)
4.  [Use  `ses.setPermissionRequestHandler()`  in all sessions that load remote content](https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content)
5.  [Do not disable  `webSecurity`](https://electronjs.org/docs/tutorial/security#5-do-not-disable-websecurity)
6.  [Define a  `Content-Security-Policy`](https://electronjs.org/docs/tutorial/security#6-define-a-content-security-policy)  and use restrictive rules (i.e.  `script-src 'self'`)
7.  [Do not set  `allowRunningInsecureContent`  to  `true`](https://electronjs.org/docs/tutorial/security#7-do-not-set-allowrunninginsecurecontent-to-true)
8.  [Do not enable experimental features](https://electronjs.org/docs/tutorial/security#8-do-not-enable-experimental-features)
9.  [Do not use  `enableBlinkFeatures`](https://electronjs.org/docs/tutorial/security#9-do-not-use-enableblinkfeatures)
10.  [`<webview>`: Do not use  `allowpopups`](https://electronjs.org/docs/tutorial/security#10-do-not-use-allowpopups)
11.  [`<webview>`: Verify options and params](https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation)
12.  [Disable or limit navigation](https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation)
13.  [Disable or limit creation of new windows](https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows)

Except for items 3, 4 & 6 above, Electron will put a warning in the dev console if one of the following issues have been detected.


## Tips and Tricks

#### Communication Protocols
You should know this by now, but if you are not using **https** / **sftp** / **wss** then the app's communications with the outside world can be very easily tampered with. Whatever you are building, please use a secure protocol everywhere.

#### Filesystem Access
Having read & write permissions to the filesystem is the holy grail for penetration testers, and if your app enables this type of interaction, consider using IPC and multiple windows (with varying permissions) in order to minimize the attack surface.

#### Encryption
If the user of your application has secrets like wallet addresses, personal information or some other kind of trade secrets, keep that information encrypted when at rest, un-encrypt it in-memory only when it is needed and make sure to overwrite / destroy the object in memory when you are done with it. But no matter how you approach this, follow these three rules:

1. do not invent a novel type of encryption
2. follow the implementation instructions explicitly
3. think about the user-experience

#### Disable developer tools in production
You probably don't want rogue hoody-wearing menaces to be executing something like this in the console of your app:
```
window.location='https://evilsite.com/looks-just-like-your-app'
```
The key-combination `CTRL-SHIFT-I` (or `ALT-CMD-I` on Mac) will open the dev tools and enable inspection of the application. It will even enable some degree of modification. Prevent the simple `evil maid` attack by catching these keypresses and `return false`. 

#### Publish checksums
```bash 
$ shasum -a 256 myApp-v1.0.0_darwin-x64.dmg
40ed03e0fb3c422e554c7e75d41ba71405a4a49d560b1bf92a00ea6f5cbd8daa myApp-v1.0.0_darwin-x64.dmg
```
When you have built your binary blobs and want to publish them e.g. on GitHub, use `shasum` and post these results somewhere prominent (like on the GitHub release page for your project) and potentially on a public blockchain, such as Steem. 

As an exercise for the reader, when the app runs for the first time, have it run shasum on itself and compare that result with a public resource. This is great in combination with a license validation scheme.

#### Sign the builds
Although not a hard requirement for sharing your app, signing code is a best practice - and it is required by both the MacOS and Windows stores. Read more about it at this [official Electron tutorial](https://electronjs.org/docs/tutorial/code-signing).

#### Use SNYK
[Snyk.io](https://snyk.io) is a service, CLI and even GitHub integration bot that tracks vulnerabilities in node modules by comparing the dependencies in your package.json with its list of compromised modules. In many cases their service can recommend minimum update versions or even provide modules that they themselves have patched. 


#### For the truly paranoid
Use a dedicated physical desktop machine for each platform target. If you have to keep this device online, make sure the OS is always updated, permits zero inbound connections from the internet / bluetooth (especially for shell / ssh) and run constant virus and rootkit checks.

Permit only GPG-signed commits to be merged and require at least two team members (who did not make the PR) to review and approve the commit.

Audit each and every single module and its dependencies.

#### Pay to get hacked
Somebody smart might have hacked your project (or an underlying library). If you are making money with this app, consider getting a [Hacker One](https://hackerone.com) account and running a constant bounty award. At least you'll be able to convince the hacker to be ethical and NOT sell the exploit to your competitor.

#### Get help
You may feel overwhelmed, because the awesomeness of Electron brings with it a great many headaches that you never wanted to think about. If this is the case, consider [reaching out](mailto:razvan.stoenescu@gmail.com) and getting expert support for the review, audit and hardening of your app by the team of seasoned devs that brought you the Quasar Framework. 

----
 
> Some text from this page has been sourced from the [Official Electron Security Guide](https://electronjs.org/docs/tutorial/security).
