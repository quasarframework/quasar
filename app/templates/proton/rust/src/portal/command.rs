extern crate web_view;
use web_view::WebView;

use std::process::Command;

use crate::portal;

pub fn call_command(cmd: String, args: Vec<String>) -> Result<String, String> {
     Command::new(cmd).args(args).output()
        .map_err(|err| err.to_string())
        .and_then(|output| {
            if output.status.success() {
                return Result::Ok(String::from_utf8_lossy(&output.stdout).to_string());
            }
            else {  
                return Result::Err(String::from_utf8_lossy(&output.stderr).to_string());
            }
        })
}

pub fn call<T: 'static>(webview: &mut WebView<T>, command: String, args: Vec<String>, callback: String, error: String) {
    portal::run_async(webview, || {
        call_command(command, args)
            .map_err(|err| format!("`{}`", err))
            .map(|output| format!("`{}`", output))
        },
        callback, error
    );
}