extern crate web_view;
use web_view::WebView;

use super::dir;
use super::file;
use super::{run_async};

use std::fs::File;
use std::io::Write;

pub fn list<T: 'static>(webview: &mut WebView<T>, path: String, callback: String, error: String) {
    run_async(webview, move || {
        dir::walk_dir(path.to_string())
        .and_then(|f| {
            serde_json::to_string(&f)
                .map_err(|err| err.to_string())
        })
    }, callback, error);
}

pub fn list_dirs<T: 'static>(webview: &mut WebView<T>, path: String, callback: String, error: String) {
    run_async(webview, move || {
        dir::list_dir_contents(&path)
            .and_then(|f| {
                serde_json::to_string(&f)
                    .map_err(|err| err.to_string())
        })
    }, callback, error);
}

pub fn write_file<T: 'static>(webview: &mut WebView<T>, file: String, contents: String, callback: String, error: String)  {
    run_async(webview, move || {
        File::create(file)
            .map_err(|err|  err.to_string())
            .and_then(|mut f| {
                f.write_all(contents.as_bytes())
                    .map_err(|err| err.to_string())
                    .map(|_| "".to_string())
            })
    }, callback, error);
}

pub fn read_text_file<T: 'static>(webview: &mut WebView<T>, path: String, callback: String, error: String) {
    run_async(webview, move || {
        file::read_string(path)
            .and_then(|f| {
                serde_json::to_string(&f)
                    .map_err(|err| err.to_string())
                    .map(|s| s.to_string())
            })
    }, callback, error);
}

pub fn read_binary_file<T: 'static>(webview: &mut WebView<T>, path: String, callback: String, error: String) {
    run_async(webview, move || {
        file::read_binary(path)
            .and_then(|f| {
                serde_json::to_string(&f)
                    .map_err(|err| err.to_string())
                    .map(|s| s.to_string())
            })
    }, callback, error);
}
