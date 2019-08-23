---
title: Get Started
desc: Start making Tauri Apps with Quasar.
---

We assume you have already installed all prerequisites:
``` 
- node >= 10.16.3
- npm >= 6.6.0
- yarn >= 1.17.3
- rustc >= 1.37.0 (don't use nightly)
- rustup >= 1.18.3
```

If this is not the case, please visit the [Tauri Environment Documentation](https://tauri.quasar.dev/docs/environment). If you are concerned about changing your working environment, please know that any versions of node, yarn and npm below those listed here are indeed vulnerable to a range of attacks. 

## Tauri dev command
Using Tauri is simple:
```bash
$ quasar create shiny-tauri-app
$ cd shiny-tauri-app
$ quasar dev -m tauri
```

This will create your app and open a webview that is rigged for HMR.

If you want to use the version of Tauri without a localhost server, add a section to your quasar.conf.js like this:
```
module.exports = function (ctx) {
  return {
    tauri: {
      embeddedServer: { active: false },
      whitelist: {
        // all: true // uncomment this line to enable all API
      },
      window: {
        title: 'Quasar Tauri App set by quasar.conf.js'
      }
    },
```

## Tauri build command
```
$ cargo install --path node_modules/@quasar/tauri/tools/rust/cargo-tauri-bundle --force
$ quasar build -m tauri
```

The final build asset will be found here:
```
/src-tauri/target/release/bundle/
```


That's it. 

To find out more about Tauri, please visit the (Tauri Documentation)[https://tauri.quasar.dev/docs].


# 1. Preparation
Until the [main repository branch](https://github.com/quasarframework/quasar/tree/tauri) has been merged into development and the [bindings/templates repository](https://github.com/quasarframework/tauri) have been published at npm, this installation of this mode is unfortunately rather convoluted. You MUST follow these instructions explicitly. It is expected that you are running NODE v10LTS, have npm and yarn installed and are familiar with the quasar cli and the command line.

Depending upon your platform, you will need a variety of tools to build Tauri apps. While we are working on the exact toolchain description, here are a few notes from the forthcoming docs - but its really up to you to make sure :


## Add Rust and Build Toolchain

### Windows 64 or 32 bit
You will need to have Visual Studio and windows-build-tools installed.

First visit the [Microsoft docs](https://docs.microsoft.com/en-us/visualstudio/install/install-visual-studio?view=vs-2019) and install Visual Studio.
```bash
$ npm install --global windows-build-tools
```

If you are running Windows 64-bit, download and run [rustup‑init.exe](https://win.rustup.rs/x86_64) and then follow the onscreen instructions.

If you are running Windows 32-bit, download and run [rustup‑init.exe](https://win.rustup.rs/i686) and then follow the onscreen instructions.

### Arch
According to the Arch manual, this is something you were born knowing.

### BSD
Similar to Arch, you already have everything installed because you compile kernels. However:
- Execution on OpenBSD requires wxallowed mount(8) option.
- FreeBSD is also supported, to install webkit2 run pkg install webkit2-gtk3.

### Ubuntu
First install Ubuntu then:
```bash
$ sudo apt update && sudo apt install libwebkit2gtk-4.0-dev build-essential
```

### MacOS
```bash
$ brew install gcc
```

### Everybody except Windows
```
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

> We have audited this bash script, and it does what it says it is supposed to do. Nevertheless, before blindly curl-banging a script, it is always wise to look at it first. Here is file as a mere [download link](https://sh.rustup.rs)

Make sure that `rustc` and `cargo` are in your $PATH. Run
```bash
$ rustc --version
latest update on 2019-07-04, rust version 1.37.0
```
and make sure you are on latest update on 2019-07-04, rust version 1.37.0 - otherwise be sure to update.

```
$ rustup update stable
$ rustup override set 1.37.0
```


## About `rustup` (from their [website](https://rustup.rs))
`rustup` installs rustc, cargo, rustup and other standard tools to Cargo's bin directory. On Unix it is located at `$HOME/.cargo/bin` and on Windows at `%USERPROFILE%\.cargo\bin`. This is the same directory that cargo install will install Rust programs and Cargo plugins.

This directory will be in your `$PATH` environment variable, which means you can run them from the shell without further configuration. **Open a new shell** and type the following:

```bash
$ rustc --version
```
or run:

```bash
source $HOME/.cargo/env

# and then

$ rustc --version
```

If you see something like `rustc 1.19.0 (0ade33941 2017-07-17)` then you are ready to Rust. If you decide Rust isn't your thing, you can completely remove it from your system by running `rustup self uninstall`.


# 2. The real installation process
After you have installed Rust and the build toolchain, it is wise to open a new shell before continuing.

```bash
$ npm install -g @quasar/cli
$ git clone https://github.com/nothingismagick/tauri-mvp.git
$ cd tauri-mvp
$ git clone https://github.com/quasarframework/tauri.git
$ git clone https://github.com/lucasfernog/quasar.git
$ cd quasar
$ git checkout feature/tauri-package
$ cd app && yarn
$ cd ../..
$ cd trollbridge
$ yarn
$ quasar dev -m tauri
```

Do some work on it or something and then come back to build:

```bash
$ cargo install --path node_modules/@quasar/tauri/tools/rust/cargo-tauri-bundle --force
$ quasar build -m tauri
```

Want to debug?
#### *nix

```bash
$ cd src-tauri
$ RUST_DEBUG=1 cargo build
```

#### Windows

```bash
$ cd src-tauri
$ set RUST_DEBUG=1
$ cargo build
```
