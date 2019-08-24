---
title: What is Quasar Tauri
desc: Introduction to the technology behind Quasar Tauri apps.
---

<img src="https://cdn.quasar.dev/logo/tauri/tauri-logo-240x240.png" style="float:left;max-width:15%;min-width:150px;margin-top:-15px;padding-right:20px" />

**Tauri** brings a mode to build Quasar Apps that creates tiny, blazing fast binaries for all major desktop platforms. In Quasar's [neverending quest](/introduction-to-quasar#Why-Quasar%3F) for performance and security, the **Quasar Tauri Team** is proud to offer an alternative to Electron (and someday soon Cordova as well).

Whether you are just starting out making apps for your meetup or regularly crunch terabyte datasets, we are absolutely confident that you will love using Tauri as much as we love making and maintaining it.

::: tip Head's Up!
Visit the [official Tauri documentation](https://tauri.quasar.dev/docs) for all the details you need to setup your system and build better apps!
:::

## Who Tauri is For
Anyone who can create a Quasar app can use Tauri, as it is *merely* a new build target. All components and plugins (suitable for Native Desktop) can be used. For the User Interface, nothing has changed, except you will probably notice that everything seems much faster.

Because of the way Tauri has been built and can be extended, developers are able to interface not only with the entire Rust ecosystem, but also with many other programming languages. Being freed of the heaviest thing in the universe and the many shortcomings of server-side Javascript suddenly opens up whole new avenues for high-performance, security-focused applications that need the purebred power, agility and community acceptance of a low-level language.

We expect to witness an entire new class of applications being built with Quasar Tauri. From a simple calender to locally crunching massive realtime feeds at particle colliders or even mesh-network based distributed message-passing ecosystems - the bar has been raised and gauntlet thrown. What will you make?

## Technical Details
**Tauri** currently leverages Cocoa/WebKit on macOS, gtk-webkit2 on Linux and MSHTML on Windows. Tauri is based on the MIT licensed prior work known as [webview](https://github.com/zserge/webview). The default binding to the underlying webview library uses Rust, but other languages are possible and only a PR away.

There are a number of design patterns that you can use in the conception of your app, but by far the most exciting one is that you can write logic in Rust and call these functions from JS in the Webview. However, you don't need to write a line of rust code to use Tauri. Just installing the Rust compiler and package manager are enough.

## How is Tauri different from Electron
Quasar loves the Electron community, and will continue to support it as long as the project remains active. Its many use-cases and brilliant project leaders are legendary and have to a great deal inspired the work behind Tauri. There are however, several well known issues with Electron - for which there is no immediate fix on the horizon. These issues are system resources, inherent security risks and open-source provenance. 

### Bloated System Resources
One of the biggest complaints that we hear about Electron is that the production asset is very large and consumes a lot of memory. Large files consume storage, have very real transit costs and just slow down everything. Ubiquitous resources are still precious, and yet Electron does nothing to address this bloat.

::: tip Tauri
<img src="https://cdn.quasar.dev/logo/tauri/tauri-logo-48x48.png" style="float:left;width:48px;margin:2px 0 0 -4px;padding-right:10px" />
app binaries normally ship at under 3 MB and use less than 1/2 the memory of the same App project bundled as an Electron App.
:::

### Security Concerns
The surface area of Electron, Chromium and the entire NPM ecosystem have proven time and time again that you have to be extremely cautious and vigilant when building Electron apps. Being able to easily reverse the ASAR file shipped with Electron means that your Electron app is delivered basically in plaintext.

::: tip Tauri
<img src="https://cdn.quasar.dev/logo/tauri/tauri-logo-48x48.png" style="float:left;width:48px;margin:2px 0 0 -4px;padding-right:10px" />
is composed not only of original rust code, but also critical code libraries that have been forked so that they are under our control. Rust is memory and thread safe. Proven security techniques like CSPs and OTPs are part and parcel of Tauri. New patterns for making, creating and analyzing secure apps are constantly being introduced.
:::

### Open Source?
Technically speaking Electron is indeed open-source. You can audit *almost* every single line of code that it uses and leverages. Unfortunately there is an elephant in the room named Chromium. Chromium is used as the interface service provider in Electron, but as it stands it will never be accepted by the Free Software Foundation - primarily because of widevine. This unfortunately mean that open source communities like PureOS will never ship an Electron app in their official App Store or distribute them via official package managers.

::: tip Tauri
<img src="https://cdn.quasar.dev/logo/tauri/tauri-logo-48x48.png" style="float:left;width:48px;margin:2px 0 0 -4px;padding-right:10px" />
aims to be acceptable for the Free Software Foundation and palatable to all freedom-respecting (as in software) members of the greater Open Source Community.

::: 
