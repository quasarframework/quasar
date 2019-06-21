#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    Read { path: String, callback: String, error: String },
    Write { file: String, contents: String, callback: String, error: String },
    List { path: String, callback: String, error: String },
    ListDirs { path: String, callback: String, error: String },
    SetTitle { title: String }
}
