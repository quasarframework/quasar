use actix_web::{web, HttpResponse};

include!(concat!(env!("OUT_DIR"), "/data.rs"));

fn file_response(path: String) -> HttpResponse {
    let mut response_builder = HttpResponse::Ok();
    let response;
    let asset = ASSETS.get(&format!("./target/compiled-web/{}", path)).unwrap().into_owned();

    if path.ends_with(".svg") {
        response = response_builder.header("content-type", "image/svg+xml").body(asset);
    }
    else if path.ends_with(".css") {
        response = response_builder.header("content-type", "text/css").body(asset);
    }
    else if path.ends_with(".html") {
        response = response_builder.header("content-type", "text/html").body(asset);
    }
    else {
        response = response_builder.header("content-type", "application/octet-stream").body(asset);
    }

    response
}

pub fn index() -> HttpResponse {
    file_response("index.html".to_string())
}

pub fn statics(path: web::Path<(String,)>) -> HttpResponse {
    file_response(format!("statics/{}", path.0))
}

pub fn img(path: web::Path<(String,)>) -> HttpResponse {
    file_response(format!("img/{}", path.0))
}

pub fn css(path: web::Path<(String,)>) -> HttpResponse {
    file_response(format!("css/{}", path.0))
}

pub fn js(path: web::Path<(String,)>) -> HttpResponse {
    file_response(format!("js/{}", path.0))
}

pub fn fonts(path: web::Path<(String,)>) -> HttpResponse {
    file_response(format!("fonts/{}", path.0))
}
