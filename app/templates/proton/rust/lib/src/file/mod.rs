use std::fs;

extern crate serde_json;

mod error;
mod extract;
mod file_move;

pub use extract::*;
pub use file_move::*;
pub use error::Error;

pub fn read_string(file: String) -> Result<String, String> {
    fs::read_to_string(file)
        .map_err(|err| err.to_string())
        .map(|c| c)
}

pub fn read_binary(file: String) -> Result<Vec<u8>, String> {
    fs::read(file)
        .map_err(|err| err.to_string())
        .map(|b| b)
}
