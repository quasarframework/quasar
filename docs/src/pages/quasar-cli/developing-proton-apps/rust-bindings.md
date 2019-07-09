---
title: Rust Bindings for Proton
desc: Notes about installing and using the Rust Bindings  
---

> Rust is blazingly fast and memory-efficient: with no runtime or garbage collector, it can power performance-critical services, run on embedded devices, and easily integrate with other languages. Rust’s rich type system and ownership model guarantee memory-safety and thread-safety — and enable you to eliminate many classes of bugs at compile-time. Rust has great documentation, a friendly compiler with useful error messages, and top-notch tooling — an integrated package manager and build tool, smart multi-editor support with auto-completion and type inspections, an auto-formatter, and more. - [https://www.rust-lang.org/](https://www.rust-lang.org/)

This combination of power, safety and usability are why we chose Rust to be the default binding for Proton. It is our intention to provide the most safe and performant native app experience (for devs and app consumers), out of the box.

If you want a deep and rather nerdy look into Rust, check out what insider Tony Arcieri has to say in his article, [Rust in 2019. Security, maturity, stability](https://tonyarcieri.com/rust-in-2019-security-maturity-stability)

## Learning Rust
You don't need to know Rust at all to use Proton - but as with all things, the rabbit hole goes as deep as you are willing to dive. If you are new to Rust, then we recommend first watching this amazing playlist of tutorials from [@tensor](https://tensor-programming.com/):
 - [Intro to Rust](https://www.youtube.com/playlist?list=PLJbE2Yu2zumDF6BX6_RdPisRVHgzV02NW)
 - [Rust Projects](https://www.youtube.com/playlist?list=PLJbE2Yu2zumDD5vy2BuSHvFZU0a6RDmgb)

At some point, learning about Rust will require a visit to the manual. Check it out:
- [Rust 1.31.0+](https://doc.rust-lang.org/stable/book/) by Steve Klabnik & Carol Nichols

## Setting up

### Installing Rust & Cargo
It's pretty simple to get Rust and its dependency manager installed.

#### *nix (MacOS, Linux) using bash
```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
::: warning
We have audited this bash script, and it does what it says it is supposed to do. Nevertheless, before blindly curl-banging a script, it is always wise to look at it first. Here is file as a mere [download link](https://sh.rustup.rs).
:::

Make sure that `rustc` and `cargo` are in your $PATH.

#### Windows 64 or 32 bit
If you are running Windows 64-bit, download and run [rustup‑init.exe](https://win.rustup.rs/x86_64) and then follow the onscreen instructions.

If you are running Windows 32-bit, download and run [rustup‑init.exe](https://win.rustup.rs/i686) and then follow the onscreen instructions.

### IDE Integration
- [VS Code](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)
- [IntelliJ](https://plugins.jetbrains.com/plugin/8182-rust)
- [ATOM](https://github.com/rust-lang/atom-ide-rust)
- [SUBLIME](https://github.com/rust-lang/rust-enhanced)
- [VIM](https://github.com/rust-lang/rust.vim)
- [EMACS](https://github.com/rust-lang/rust-mode)


## Introduction
Much like the Node ecosystem, there are a number of "modules" called crates that can be delivered via cargo. 

## Security



