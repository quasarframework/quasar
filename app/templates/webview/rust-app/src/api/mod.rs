use std::process::Command;

pub fn call(cmd: String, args: Vec<String>) -> Result<String, String> {
     Command::new(cmd).args(args).output()
        .map_err(|err| err.to_string())
        .and_then(|output| {
            if output.status.success() {
                return Result::Ok(String::from_utf8_lossy(&output.stdout).to_string());
            }
            else {  
                return Result::Err(String::from_utf8_lossy(&output.stderr).to_string());
            }
        })
}