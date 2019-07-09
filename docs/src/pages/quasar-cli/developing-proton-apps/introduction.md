---
title: What is Quasar Proton
desc: Introduction to the technology behind Quasar Proton apps.
---

**Proton** brings a mode to build Quasar Apps that creates tiny, blazing fast binaries for all major desktop platforms. In Quasar's [neverending quest](/introduction-to-quasar#Why-Quasar%3F) for performance and security, the core team is proud to offer an alternative to Electron.

This breathtaking new way to create cross-platform apps from the comfort of the quasar-cli is fast, efficient and secure. Whether you are just starting out making apps for your meetup or regularly crunch terrabyte datasets, we are absolutely confident that you will love using Proton as much as we loved making it.

## Who Proton is For
Anyone who can create a Quasar app can use Proton, as it is *merely* a new build target. All components and plugins (suitable for Native Desktop) can be used. For the User Interface, nothing has changed, except you will probably notice that everything seems much faster.

Because of the way Proton has been built and can be extended, developers are able to interface not only with the entire Rust ecosystem, but also with many other programming languages. Being freed of the heaviest thing in the universe and the many shortcomings of server-side Javascript suddenly opens up whole new avenues for high-performance, security-focused applications that need the purebred power, agility and community acceptance of a low-level language.

We expect to witness an entire new class of applications being built with Quasar Proton. From a simple calender to locally crunching massive realtime feeds at particle colliders or even mesh-network based distributed message-passing ecosystems - the bar has been raised and gauntlet thrown. What will you make?

## Technical Details

**Proton** leverages Cocoa/WebKit on macOS, gtk-webkit2 on Linux and MSHTML (IE10/11) on Windows. Proton is based on the MIT licensed prior work known as [webview](https://github.com/zserge/webview), but has been forked for reasons explained below. The default binding to the underlying webview library uses Rust, but other languages are possible and only a PR away.


## How is Proton different from Electron
We love the Electron community, and will continue to support it as long as the project remains active. Its many use-cases and brilliant project leaders are legendary and to a great deal have inspired the work behind Proton. There are however, several well known issues with Electron - for which there is no immediate fix on the horizon. These issues are open-source provenance, system resources and inherent security risks. 

### Open Source
Technically speaking Electron is indeed open-source. You can audit *almost* every single line of code that it uses and leverages. Unfortunately there is an elephant in the room named Chromium. Chromium is used as the interface service provider in Electron, but as it stands it will never be accepted by the Free Software Foundation - primarily because of widevine but also because of long-lingering license header issues. These problems unfortunately mean that open source communities like PureOS will never ship an Electron app in their App Store.

::: tip Proton
aims to be acceptable for the Free Software Foundation and palatable to all freedom-respecting (as in software) members of the greater Open Source Community.
::: 

### System Resources
One of the biggest complaints that we hear about Electron is that the production asset is very large and consumes a lot of memory. Large files consume storage, have real transit costs and just slow down everything. 

::: tip Proton 
app binaries are generally less than 10MB.
:::

### Security Risks
The surface area of Electron, Chromium and the entire NPM ecosystem have proven time and time again that you have to be extremely cautious and vigilant when building Electron apps. There is a 12-point thesis about Security, and even if you follow the rules - there are malicious developers out there who will try to craft sneaky supply chain attacks. They have even been successful in a few recent high-profile cases. 

::: tip Proton
bindings of essential security character have been forked so that they are under our control. The `rust-security` crate ships by default. Rust is memory and thread safe.
:::

### Comparison
|  | Proton | Electron |
|--|--------|----------|
| Binary Size † | TODO | TODO |
| Memory Consumption † | TODO | TODO |
| Benchmark FPS † | TODO | TODO |
| Interface Service Provider | Varies | Chromium |
| Quasar UI | VueJS | VueJS |
| Backend Binding | Rust | Node.js (ECMAScript) |
| Underlying Engine | C/C++ | V8 (C/C++) |
| FLOSS | Yes | No |
| Multithreading | Yes | No |
| GPU Support | Yes | No |
| Geolocation | Yes | No |
| WebAPI | Yes | No |
| Multiple Windows | Yes | Yes |
| Can Render PDF | Yes | No |
| Updater | Yes | Yes |
| Inter Process Communication (IPC) | Yes | Yes |
| Cross Platform | Yes | Yes |
| Custom App Icon | Yes | Yes |

† We have created a Benchmark Application. See [here](#todo) 
