#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate dirs;
extern crate clap;
use web_view::*;
use std::fs::File;
use std::io::Write;
use clap::{Arg, App};

mod dir;
mod file;
mod rpc;
mod cmd;

fn main() {
    let dev = cfg!(feature = "dev");

    let arg;
    if dev {
        arg = Arg::with_name("url")
            .short("u")
            .long("url")
            .value_name("URL")
            .help("Loads the specified URL into webview")
            .required(true)
            .takes_value(true);
    }
    else {
        arg = Arg::with_name("debug")
            .short("d")
            .long("debug")
            .value_name("DEBUG")
            .help("Loads the webview with debug enabled");
    }
    let app = App::new("app")
        .version("1.0.0")
        .author("Author")
        .about("About")
        .arg(arg);
    
    let matches = app.get_matches();
    
    let content;
    let debug;
    if dev {
        content = Content::Url(matches.value_of("url").unwrap());
        debug = true;
    }
    else {
        content = Content::Html("../../../dist/webview/index.html");
        debug = matches.is_present("debug");
    }

    web_view::builder()
        .title("MyAppTitle")
        .content(content)
        .size(2068, 1024) // TODO:Resolution is fixed right now, change this later to be dynamic
        .resizable(true)
        .debug(debug)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use cmd::Cmd::*;
            match serde_json::from_str(arg).unwrap() {
                Init => (),
                Read { file } => {
                    let _path = file.clone();
                    let contents = file::read_file(file);
                    let cb = "load_file".to_string();
                    let formatted_string = rpc::format_callback(cb, contents, _path);
                    _webview.eval(&formatted_string).expect("Unable to eval webview");
                }
                Write { file, contents } => {
                    let mut f = File::create(file).unwrap();
                    f.write_all(contents.as_bytes()).expect("Unable to write file");
                }
                ListDirs{cb, home, path} => {
                    let mut json_dir_listing:String;
                    dir::list_home_dir_contents();
                    if home == true {
                        println!("Listing Home!");
                        json_dir_listing = dir::list_home_dir_contents();
                    } else {
                        println!("Listing {}", path);
                        json_dir_listing = dir::list_dir_contents(&path);
                    }
                    let eval_string = rpc::format_callback(cb, json_dir_listing, path);
                    _webview.eval(eval_string.as_str()).expect("Unable to eval webview");
                }
                List { path, cb } => {
                    let path_copy = &path.clone();
                    let listing_json = dir::walk_dir(path_copy.to_string());
                    let formatted_string = rpc::format_callback(cb, listing_json, path_copy.to_string());
                    _webview.eval(formatted_string.as_str()).expect("Unable to eval webview");
                }
            }
            Ok(())
        })
        .run()
        .unwrap();
}