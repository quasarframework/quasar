pub fn format_callback(cb:String, listing_json:String, path:String) -> String {
    let formatted_string = &format!("{}({},'{}')", cb, listing_json, path.clone());
    return formatted_string.to_string();
}
