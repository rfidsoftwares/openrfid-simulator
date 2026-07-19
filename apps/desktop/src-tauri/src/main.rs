#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::api::process::Command;

fn main() {
  tauri::Builder::default()
    .setup(|_app| {
      let (_rx, _child) = Command::new_sidecar("hopeland-runner")
        .expect("failed to setup sidecar")
        .spawn()
        .expect("failed to spawn sidecar");
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
