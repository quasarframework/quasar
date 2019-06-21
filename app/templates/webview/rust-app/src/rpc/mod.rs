pub fn format_callback(cb:String, listing_json:String) -> String {
    let formatted_string = &format!("{}({})", cb, listing_json);
    return formatted_string.to_string();
}
