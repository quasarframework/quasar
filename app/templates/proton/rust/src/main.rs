#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate clap;

#[cfg(feature = "prod")]
#[macro_use]
extern crate rouille;

#[cfg(feature = "dev")]
use clap::{Arg, App};

#[cfg(feature = "prod")]
use std::thread;

mod portal;
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
        let server_url = "0.0.0.0:5000";
        content = web_view::Content::Url(format!("http://{}", server_url));
        debug = cfg!(debug_assertions);
        
        thread::spawn(move || {
            rouille::start_server("0.0.0.0:5000", move |request| {
                router!(request,
                    (GET) (/) => {
                        // TODO load the correct html index file (the filename is configurable through quasar.conf.js) (include the html into assets?)
                        rouille::Response::html(include_str!("../../dist/webview/index.html"))
                    },

                    (GET) (/js/{id: String}) => {
                        rouille::Response::text(String::from_utf8(ASSETS.get(&format!("../dist/webview/js/{}", id)).unwrap().into_owned()).expect("ops"))
                    },
                    _ => rouille::Response::empty_404()
                )
            });
        });
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
                ReadAsString { path, callback, error } => {
                    portal::file_system::read_text_file(_webview, path, callback, error);
                }
                ReadAsBinary { path, callback, error } => {
                    portal::file_system::read_binary_file(_webview, path, callback, error);
                }
                Write { file, contents, callback, error } => {
                    portal::file_system::write_file(_webview, file, contents, callback, error);
                }
                ListDirs { path, callback, error } => {
                    portal::file_system::list_dirs(_webview, path, callback, error);

                }
                List { path, callback, error } => {
                    portal::file_system::list(_webview, path, callback, error);
                }
                SetTitle { title } => {
                    _webview.set_title(&title).unwrap();
                }
                Call { command, args, callback, error } => {
                    portal::command::call(_webview, command, args, callback, error);
                }
            }
            Ok(())
        })
        .build().unwrap();

    webview.run().unwrap();
}