extern crate includedir_codegen;

use includedir_codegen::Compression;

fn main() {
    includedir_codegen::start("ASSETS")
        .dir("../dist/webview/js", Compression::Gzip)
        .build("data.rs")
        .unwrap();
}