---
title: Other Proton Bindings
desc: Introduction to the technology behind Quasar Proton apps.
---

There are tons of excellent programming languages - and definitely reasons to choose one over the other. Since the Quasar Team's resources are finite, we made the decision to ship Rust as the default language for bindings. See [Rust Bindings](/quasar-cli/developing-proton-apps/rust-bindings) to discover why we made this decision.

If you are interested in working with us to bring one of these (or other) bindings into Quasar Core - or sponsoring the work needed to introduce one of them - please reach out via one of the appropriate channels.

## Compliance Checklist
Any new official binding will have to be compliant with a bunch of things:

- Promise based File System Access
- App Icons
- Frameless Mode
- Build on MacOS, Linux, Windows
- STDOUT Passthrough with Command Invocation
- Self Updater
- Inter Process Communication (IPC)
- Documentation
- Serve https

## List of Bindings
- [C](https://github.com/zserge/webview)
- [C++](https://github.com/zserge/webview)
- [Go](https://github.com/zserge/webview)
- [Python](https://github.com/zserge/webview-python)
- [Nim](https://github.com/oskca/webview)
- [Haskell](https://github.com/lettier/webviewhs)
- [C#](https://github.com/iwillspeak/webview-cs)

::: tip
We ran preliminary tests with C++ and Go, and it is clear that they will work.
:::
