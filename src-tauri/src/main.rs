#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri_plugin_store::PluginBuilder;

fn main() {
    // let port = portpicker::pick_unused_port().expect("failed to find unused port"); 
    let port = 19555;
    tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        // .plugin(tauri_plugin_localhost::Builder::new(port).build())
        // .invoke_handler(tauri::generate_handler![request_get])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
