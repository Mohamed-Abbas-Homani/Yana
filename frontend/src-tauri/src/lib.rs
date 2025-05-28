use tauri::{AppHandle, Manager};
use tauri_plugin_shell::{process::CommandEvent, ShellExt};

#[tauri::command]
async fn run_yana_back_sidecar(app: AppHandle) {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .unwrap()
        .to_string_lossy()
        .to_string();

    if let Ok((mut rx, _)) = app
        .shell()
        .sidecar("yana-back")
        .unwrap()
        .args([app_data_dir.clone()])
        .spawn()
    {
        tauri::async_runtime::spawn(async move {
            while let Some(event) = rx.recv().await {
                match event {
                    CommandEvent::Stdout(line) => println!("{}", String::from_utf8_lossy(&line)),
                    CommandEvent::Stderr(line) => eprintln!("{}", String::from_utf8_lossy(&line)),
                    CommandEvent::Error(err) => eprintln!("Error: {}", err),
                    _ => {}
                }
            }
        });
    } else {
        eprintln!("Failed to run Yana Back");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![run_yana_back_sidecar])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
