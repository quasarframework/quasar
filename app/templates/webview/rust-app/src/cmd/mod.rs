#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    Read { path: String, callback: String },
    Write { file: String, contents: String },
    List { path: String, callback: String },
    ListDirs { path: String, callback: String },
    SetTitle { title: String }
}
