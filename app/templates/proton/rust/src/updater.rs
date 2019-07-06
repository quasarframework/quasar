#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate sysinfo;
extern crate proton;

use sysinfo::{ProcessExt, SystemExt, Process, Signal, System};

fn get_parent_process(system: &mut sysinfo::System) -> Result<&Process, String> {
    let pid = sysinfo::get_current_pid().unwrap();
    //let mut system = sysinfo::System::new();
    system.refresh_process(pid);
    let current_process = system.get_process(pid).ok_or("Could not get current process")?;
    let parent_pid = current_process.parent().ok_or("Could not get parent PID")?;
    let parent_process = system.get_process(parent_pid).ok_or("Could not get parent process")?;
    
    println!("{}", pid);
    Ok(parent_process)
}

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
        .current_version("1.0.0")
        .build().unwrap()
        .update().unwrap();
    println!("found releases: {}", status.version());

    /*let tmp_dir = proton::dir::with_temp_dir(|dir| {
        let file_path = dir.path().join("my-temporary-note.pdf");
        let mut tmp_archive = std::fs::File::create(file_path).unwrap();
        proton::http::download(&"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf".to_string(), &mut tmp_archive, true).unwrap();
    });*/

    match get_parent_process(&mut System::new()) {
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