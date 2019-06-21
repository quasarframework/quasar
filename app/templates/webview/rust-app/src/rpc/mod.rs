pub fn format_callback(function_name: String, arg: String) -> String {
    let formatted_string = &format!("{}({})", function_name, arg);
    return formatted_string.to_string();
}
