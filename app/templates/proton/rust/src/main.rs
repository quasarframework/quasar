#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate clap;
extern crate proton;

#[cfg(feature = "prod")]
#[macro_use]
extern crate rouille;

#[cfg(feature = "dev")]
use clap::{Arg, App};

#[cfg(feature = "prod")]
use std::thread;

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
        if let Some(available_port) = proton::tcp::get_available_port() {
            let server_url = format!("{}:{}", "0.0.0.0", available_port);
            content = web_view::Content::Url(format!("http://{}", server_url));
            debug = cfg!(debug_assertions);

            thread::spawn(move || {
                rouille::start_server(server_url, move |request| {
                    router!(request,
                        (GET) (/) => {
                            rouille::Response::html(String::from_utf8(ASSETS.get("../dist/proton/UnPackaged/index.html").unwrap().into_owned()).unwrap())
                        },

                        (GET) (/js/{id: String}) => {
                            rouille::Response::text(String::from_utf8(ASSETS.get(&format!("../dist/proton/UnPackaged/js/{}", id)).unwrap().into_owned()).unwrap())
                        },

                        (GET) (/css/{id: String}) => {
                            rouille::Response::from_data("text/css;charset=utf-8", ASSETS.get(&format!("../dist/proton/UnPackaged/css/{}", id)).unwrap().into_owned())
                        },

                        // webpack managed assets
                        (GET) (/img/{id: String}) => {
                            rouille::Response::from_data("application/octet-stream", ASSETS.get(&format!("../dist/proton/UnPackaged/img/{}", id)).unwrap().into_owned())
                        },

                        // static assets
                        (GET) (/statics/{id: String}) => {
                            rouille::Response::from_data("application/octet-stream", ASSETS.get(&format!("../dist/proton/UnPackaged/statics/{}", id)).unwrap().into_owned())
                        },

                        (GET) (/fonts/{id: String}) => {
                            rouille::Response::from_data("application/octet-stream", ASSETS.get(&format!("../dist/proton/UnPackaged/fonts/{}", id)).unwrap().into_owned())
                        },

                        _ => rouille::Response::empty_404()
                    )
                });
            });
        }
        else
        {
            panic!("Could not find an open port");
        }
    }

    let webview = web_view::builder()
        .title("MyAppTitle")
        .content(content)
        .size(800, 600) // TODO:Resolution is fixed right now, change this later to be dynamic
        .resizable(true)
        .debug(debug)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use cmd::Cmd::*;
            match serde_json::from_str(arg).unwrap() {
                Init => (),
                ReadAsString { path, callback, error } => {
                    proton::file_system::read_text_file(_webview, path, callback, error);
                }
                ReadAsBinary { path, callback, error } => {
                    proton::file_system::read_binary_file(_webview, path, callback, error);
                }
                Write { file, contents, callback, error } => {
                    proton::file_system::write_file(_webview, file, contents, callback, error);
                }
                ListDirs { path, callback, error } => {
                    proton::file_system::list_dirs(_webview, path, callback, error);

                }
                List { path, callback, error } => {
                    proton::file_system::list(_webview, path, callback, error);
                }
                SetTitle { title } => {
                    _webview.set_title(&title).unwrap();
                }
                Call { command, args, callback, error } => {
                    proton::command::call(_webview, command, args, callback, error);
                }
            }
            Ok(())
        })
        .build().unwrap();

    webview.run().unwrap();
}
