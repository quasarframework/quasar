extern crate sysinfo;

pub use sysinfo::{ProcessExt, SystemExt, Process, System, Signal};

pub fn get_parent_process(system: &mut sysinfo::System) -> Result<&Process, String> {
    let pid = sysinfo::get_current_pid().unwrap();
    system.refresh_process(pid);
    let current_process = system.get_process(pid).ok_or("Could not get current process")?;
    let parent_pid = current_process.parent().ok_or("Could not get parent PID")?;
    let parent_process = system.get_process(parent_pid).ok_or("Could not get parent process")?;
    
    println!("{}", pid);
    Ok(parent_process)
}
