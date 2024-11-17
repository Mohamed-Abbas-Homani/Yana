use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

#[tauri::command]
async fn run_mash_notes_back_sidecar(app: tauri::AppHandle) {
    if let Ok((mut rx, _)) = app.shell().sidecar("mash-notes-back").unwrap().spawn() {
        tauri::async_runtime::spawn(async move {
            while let Some(event) = rx.recv().await {
                match event {
                    CommandEvent::Stdout(line) => {
                        let line_str = String::from_utf8_lossy(&line);
                        println!("{}", line_str);
                    }
                    CommandEvent::Stderr(line) => {
                        let line_str = String::from_utf8_lossy(&line);
                        eprintln!("{}", line_str);
                    }
                    CommandEvent::Error(err) => {
                        eprintln!("{}", err);
                    }
                    _ => {}
                }
            }
        });
    } else {
        eprintln!("Failed to spawn sidecar");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![run_mash_notes_back_sidecar])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
