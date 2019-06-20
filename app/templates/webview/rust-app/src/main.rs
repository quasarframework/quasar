#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate dirs;
extern crate clap;
use std::fs::File;
use std::io::Write;

#[cfg(feature = "dev")]
use clap::{Arg, App};
#[cfg(feature = "prod")]
use std::env;

mod dir;
mod file;
mod rpc;
mod cmd;

include!(concat!(env!("OUT_DIR"), "/data.rs"));

fn main() {
    let debug;
    let content;
    let _matches: clap::ArgMatches;

    #[cfg(feature = "dev")]
    {
        let app = App::new("app")
            .version("1.0.0")
            .author("Author")
            .about("About")
            .arg(Arg::with_name("url")
                .short("u")
                .long("url")
                .value_name("URL")
                .help("Loads the specified URL into webview")
                .required(true)
                .takes_value(true)
            );
    
        _matches = app.get_matches();
        content = web_view::Content::Url(_matches.value_of("url").unwrap());
        debug = true;
    }
    #[cfg(feature="prod")]
    {
        // TODO load the correct html index file (the filename is configurable through quasar.conf.js) (include the html into assets?)
        let html = include_str!("../../../dist/webview/index.html");
        content = web_view::Content::Html(html);
        debug = cfg!(debug_assertions);
    }

    let webview = web_view::builder()
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
                    let contents = serde_json::to_string(&file::read_file(file)).unwrap().to_string();
                    let cb = "load_file".to_string();
                    let formatted_string = rpc::format_callback(cb, contents, _path);
                    _webview.eval(&formatted_string).expect("Unable to eval webview");
                }
                Write { file, contents } => {
                    let mut f = File::create(file).unwrap();
                    f.write_all(contents.as_bytes()).expect("Unable to write file");
                }
                ListDirs{cb, path} => {
                    let mut json_dir_listing:String;
                     println!("Listing {}", path);
                    json_dir_listing = serde_json::to_string(&dir::list_dir_contents(&path)).unwrap();
                    let eval_string = rpc::format_callback(cb, json_dir_listing, path);
                    _webview.eval(eval_string.as_str()).expect("Unable to eval webview");
                }
                List { path, cb } => {
                    let path_copy = &path.clone();
                    let listing_json = serde_json::to_string(&dir::walk_dir(path_copy.to_string())).unwrap();
                    let formatted_string = rpc::format_callback(cb, listing_json, path_copy.to_string());
                    _webview.eval(formatted_string.as_str()).expect("Unable to eval webview");
                }
                SetTitle { title } => {
                    _webview.set_title(&title).unwrap();
                }
            }
            Ok(())
        })
        .build().unwrap();

    #[cfg(feature="prod")]
    {
        ASSETS.set_passthrough(env::var_os("PASSTHROUGH").is_some());
        let handle = webview.handle();
        handle.dispatch(move |webview| {
            let mut files = ASSETS.file_names().collect::<Vec<_>>();
            files.sort();
            for name in files {
                 if name.contains("ie.polyfills") && !cfg!(target_os = "windows") {
                    continue;
                }
                webview.eval(&String::from_utf8(ASSETS.get(name).unwrap().into_owned()).unwrap()).unwrap();
            }
            Ok(())
        }).unwrap();
    }

    webview.run().unwrap();
}