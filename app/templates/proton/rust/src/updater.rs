extern crate serde_derive;
extern crate proton;
extern crate serde_json;

use crate::proton::process::{ProcessExt, SystemExt, Signal};

fn main() {
    let target = proton::platform::target_triple().unwrap();
    let app_command = proton::command::relative_command("app".to_string()).unwrap();
    let status = proton::updater::github::Update::configure().unwrap()
        .repo_owner("jaemk")
        .repo_name("self_update")
        .target(&target)
        .bin_path_in_archive("github")
        .bin_name("app")
        .bin_install_path(&proton::command::command_path("app".to_string()).unwrap())
        .show_download_progress(true)
        .current_version(env!("CARGO_PKG_VERSION"))
        .build().unwrap()
        .update().unwrap();
    println!("found releases: {}", status.version());

    /*let tmp_dir = proton::dir::with_temp_dir(|dir| {
        let file_path = dir.path().join("my-temporary-note.pdf");
        let mut tmp_archive = std::fs::File::create(file_path).unwrap();
        proton::http::download(&"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf".to_string(), &mut tmp_archive, true).unwrap();
    });*/

    match proton::process::get_parent_process(&mut proton::process::System::new()) {
        Ok(parent_process) => {
            if parent_process.name() == "app" {
                parent_process.kill(Signal::Kill);
                std::thread::sleep(std::time::Duration::from_secs(1));
                std::process::Command::new(app_command).spawn().unwrap();
            }
        },
        _ => {}
    }
}