use std::fs::File;
use std::io::Read;

extern crate serde_json;

pub fn read_file(file:String) -> Result<String, String> {
    let _path = file.clone();
    File::open(file)
        .map_err(|err| err.to_string())
        .and_then(|mut file| {
            let mut contents = String::new();
            file.read_to_string(&mut contents)
                .map_err(|err| err.to_string())
                .map(|_| contents)
        })
}
