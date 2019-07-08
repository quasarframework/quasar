#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate clap;
extern crate proton;

#[cfg(not(feature = "dev"))]
extern crate actix_web;

#[cfg(not(feature = "dev"))]
use actix_web::{web, App, HttpServer};

#[cfg(feature = "dev")]
use clap::{Arg, App};

#[cfg(not(feature = "dev"))]
use std::thread;

mod cmd;
mod server;

fn main() {
    let debug;
    let content;
    let _matches: clap::ArgMatches;

    #[cfg(not(feature="dev"))]
    {
        thread::spawn(|| {
            proton::command::spawn_relative_command("updater".to_string(), Vec::new(), std::process::Stdio::inherit()).unwrap();
        });
    }

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
    #[cfg(not(feature="dev"))]
    {
        if let Some(available_port) = proton::tcp::get_available_port() {
            let server_url = format!("{}:{}", "0.0.0.0", available_port);
            content = web_view::Content::Url(format!("http://{}", server_url));
            debug = cfg!(debug_assertions);

            thread::spawn(move || {
                HttpServer::new(|| {
                    App::new()
                        .service(web::resource("/").to(server::index))
                        .service(web::resource("/js/{path:.*}").to(server::js))
                        .service(web::resource("/css/{path:.*}").to(server::css))
                        .service(web::resource("/statics/{path:.*}").to(server::statics))
                        .service(web::resource("/img/{path:.*}").to(server::img))
                        .service(web::resource("/fonts/{path:.*}").to(server::fonts))
                })
                .bind(server_url).unwrap()
                .run().unwrap();
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
            // leave this as is to use the proton API from your JS code
            if !proton::api::handler(_webview, arg)
            {
                use cmd::Cmd::*;
                match serde_json::from_str(arg) {
                    Err(_) => {},
                    Ok(command) => {
                        match command {
                            // definitions for your custom commands from Cmd here
                            MyCustomCommand { argument } => {
                                //  your command code
                                println!("{}", argument);
                            }
                        }
                    }
                }
            }
            
            Ok(())
        })
        .build().unwrap();

    webview.run().unwrap();
}
