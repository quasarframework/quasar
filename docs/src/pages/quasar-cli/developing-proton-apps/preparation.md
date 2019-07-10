---
title: Proton Preparation
desc: How to manage Proton mode in a Quasar app.
---
Before we dive in to the actual development, we need to do some preparation work. This setup shows how to get up and running with Proton and Rust.

::: warning HERE BE DRAGONS
Although we have confirmed that the approach described here works for Mac, Windows and Linux, we have not tested all possible operating systems, versions and hardware. Please feel motivated to help us make this guide more accurate.
:::

## 1. Add Quasar Proton Mode
In order to develop/build a Quasar Proton app, we need to add the Proton mode to our Quasar project. What this does is that it yarn installs some Proton packages and creates `/src-proton` folder.
```bash
$ quasar mode add proton
```

## 2. Add Rust and Build Toolchain

### Arch

[For Arch devs](https://www.archlinux.org/packages/community/x86_64/rustup/)


### Ubuntu
```html
sudo apt install libwebkit2gtk-4.0-dev
```



### MacOS

```bash
$ brew install 
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh 
$ cargo install cargo-bundle
```
::: warning
We have audited this bash script, and it does what it says it is supposed to do. Nevertheless, before blindly curl-banging a script, it is always wise to look at it first. Here is file as a mere [download link](https://sh.rustup.rs).
:::

Make sure that `rustc` and `cargo` are in your $PATH.

#### Windows 64 or 32 bit
You will need to have Visual Studio and windows-build-tools installed.

First visit the [Microsoft docs](https://docs.microsoft.com/en-us/visualstudio/install/install-visual-studio?view=vs-2019) and install Visual Studio.
``` 
$ npm install --global windows-build-tools
$ yarn global add windows-build-tools
```

If you are running Windows 64-bit, download and run [rustup‑init.exe](https://win.rustup.rs/x86_64) and then follow the onscreen instructions.

If you are running Windows 32-bit, download and run [rustup‑init.exe](https://win.rustup.rs/i686) and then follow the onscreen instructions.

Then make sure to add `cargo-bundle`:
```
$ cargo install cargo-bundle
```


### IDE Integration
- [VS Code](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)
- [IntelliJ](https://plugins.jetbrains.com/plugin/8182-rust)
- [ATOM](https://github.com/rust-lang/atom-ide-rust)
- [SUBLIME](https://github.com/rust-lang/rust-enhanced)
- [VIM](https://github.com/rust-lang/rust.vim)
- [EMACS](https://github.com/rust-lang/rust-mode)




The new folder has the following structure:
```bash
.
└── src-proton/
    ├── icons/                    # Icons of your app for all platforms
    |   ├── icon.icns             # Icon file for Darwin (MacOS) platform
    |   ├── icon.ico              # Icon file for win32 (Windows) platform
    |   ├── linux-256x256.png     # Icon file for Linux platform
    |   └── ...                   # Many other icons
    ├── lib/                      # Project source dependencies
    |   ├── src/                  # Rust crate source files 
    |   └── Cargo.toml            # Root Package list
    ├── src/                      # Main thread source code
    |   ├── cmd.rs                # Icon file for Darwin (MacOS) platform
    |   ├── main.rs               # Icon file for win32 (Windows) platform
    |   └── updater.rs            # Icon file for Linux platform
    ├── .gitignore                # gitignore definition
    ├── build.rs                  # Rust build script
    ├── Cargo.lock                # Dependency lockfile
    └── Cargo.toml                # Dependency sources
```

### A note for Windows Users
If you run into errors during npm install about node-gyp, then you most likely do not have the proper build tools installed on your system. Build tools include items like Python and Visual Studio. Fortunately, there are a few packages to help simplify this process.

The first item we need to check is our npm version and ensure that it is not outdated. This is accomplished using [npm-windows-upgrade](https://github.com/felixrieseberg/npm-windows-upgrade). If you are using yarn, then you can skip this check.

Once that is complete, we can then continue to setup the needed build tools. Using [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools), most of the dirty work is done for us. Installing this globally will in turn setup Visual C++ packages, Python, and more.

::: warning Note: April 2019
In Powershell.exe (Run as Admin) `npm install --global windows-build-tools` seems to fail at the moment with errors pointing to python2 and vctools. You can get around this with Chocolatey. One-liner install:

**Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))**

and then run `choco upgrade python2 visualstudio2017-workload-vctools`.
:::

At this point things should successfully install, but if not then you will need a clean installation of Visual Studio. Please note that these are not problems with Quasar, but they are related to NPM and Windows.

## 2. Start Developing
If you want to jump right in and start developing, you can skip the previous step with "quasar mode" command and issue:

```bash
$ quasar dev -m proton
```

This will add the Proton mode automatically, if it is missing.
It will open up a Proton window that will render your app.
