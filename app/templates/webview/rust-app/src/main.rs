#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate dirs;
extern crate clap;

#[cfg(feature = "prod")]
#[macro_use]
extern crate rouille;

use std::fs::File;
use std::io::Write;

#[cfg(feature = "dev")]
use clap::{Arg, App};

#[cfg(feature = "prod")]
use std::thread;

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
                Read { path, callback, error } => {
                    let _path = path.clone();
                    let callback_fn;
                    let arg;

                    match file::read_file(_path)
                        .and_then(|f| {
                            serde_json::to_string(&f)
                                .map_err(|err| err.to_string())
                                .map(|s| s.to_string())
                        }) {
                            Ok(f) => {
                                callback_fn = callback;
                                arg = f;
                            },
                            Err(err) => {
                                callback_fn = error;
                                arg = format!("\"{}\"", err);
                            }
                        }

                    let formatted_string = rpc::format_callback(callback_fn, arg);
                    _webview.eval(&formatted_string).expect("Unable to eval webview");
                }
                Write { file, contents, callback, error } => {
                    let callback_fn;
                    let arg;
                    match File::create(file)
                        .map_err(|err|  err.to_string())
                        .and_then(|mut f| {
                            f.write_all(contents.as_bytes())
                                .map_err(|err| err.to_string())
                        }) {
                            Ok(_) => {
                                callback_fn = callback;
                                arg = "".to_string();
                            },
                            Err(err) => {
                                callback_fn = error;
                                arg = format!("\"{}\"", err);
                            }
                        }

                     let eval_string = rpc::format_callback(callback_fn, arg);
                    _webview.eval(eval_string.as_str()).expect("Unable to eval webview");
                }
                ListDirs{ path, callback, error } => {
                    let arg;
                    let callback_fn;

                    match dir::list_dir_contents(&path)
                        .and_then(|f| {
                            serde_json::to_string(&f)
                                .map_err(|err| err.to_string())
                        }) {
                            Ok(f) => {
                                callback_fn = callback;
                                arg = f;
                            },
                            Err(err) => {
                                callback_fn = error;
                                arg = format!("\"{}\"", err);
                            }
                        }

                     println!("Listing {}", path);
                    let eval_string = rpc::format_callback(callback_fn, arg);
                    _webview.eval(eval_string.as_str()).expect("Unable to eval webview");
                }
                List { path, callback, error } => {
                    let path_copy = &path.clone();
                    let callback_fn;
                    let arg;

                    match dir::walk_dir(path_copy.to_string())
                        .and_then(|f| {
                            serde_json::to_string(&f)
                                .map_err(|err| err.to_string())
                        })  {
                            Ok(f) => {
                                callback_fn = callback;
                                arg = f;
                            },
                            Err(err) => {
                                callback_fn = error;
                                arg = format!("\"{}\"", err);
                            }
                        }

                    let formatted_string = rpc::format_callback(callback_fn, arg.to_string());
                    _webview.eval(formatted_string.as_str()).expect("Unable to eval webview");
                }
                SetTitle { title } => {
                    _webview.set_title(&title).unwrap();
                }
            }
            Ok(())
        })
        .build().unwrap();

    webview.run().unwrap();
}