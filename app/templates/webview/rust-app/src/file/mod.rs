use std::fs;

extern crate serde_json;

pub fn read_file(file:String) -> Result<Vec<u8>, String> {
    let _path = file.clone();
    fs::read(file)
        .map_err(|err| err.to_string())
        .map(|b| b)
}
