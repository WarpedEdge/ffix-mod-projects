import os
import shutil

def list_directories(path):
    """List all directories in the given path."""
    return [d for d in os.listdir(path) if os.path.isdir(os.path.join(path, d))]

def select_directory(prompt, directories):
    """Prompt the user to select a directory from a list."""
    print(prompt)
    for i, directory in enumerate(directories, start=1):
        print(f"{i}: {directory}")

    while True:
        try:
            choice = int(input("Enter the number of your choice: ")) - 1
            if 0 <= choice < len(directories):
                return directories[choice]
            else:
                print("Invalid choice. Please select a valid number.")
        except ValueError:
            print("Invalid input. Please enter a number.")

def main():
    base_dir = os.getcwd()
    memoria_export_dir = os.path.join(base_dir, "MemoriaExportAnimations")
    characters_dir = os.path.join(base_dir, "Characters")

    # Ensure both directories exist
    if not os.path.exists(memoria_export_dir):
        print(f"Error: {memoria_export_dir} does not exist.")
        return

    if not os.path.exists(characters_dir):
        print(f"Error: {characters_dir} does not exist.")
        return

    # Get source folder from MemoriaExportAnimations
    source_folders = list_directories(memoria_export_dir)
    if not source_folders:
        print("No folders found in MemoriaExportAnimations.")
        return

    source_folder = select_directory("Select a folder to copy from (MemoriaExportAnimations):", source_folders)
    source_path = os.path.join(memoria_export_dir, source_folder)

    # Get target character folder from Characters
    character_folders = list_directories(characters_dir)
    if not character_folders:
        print("No character folders found in Characters.")
        return

    target_character = select_directory("Select a target character folder (Characters):", character_folders)
    target_character_path = os.path.join(characters_dir, target_character)

    # Define target Mimic directory
    mimic_path = os.path.join(target_character_path, "Mimic", source_folder)
    os.makedirs(mimic_path, exist_ok=True)

    # Copy files
    for item in os.listdir(source_path):
        source_item = os.path.join(source_path, item)
        target_item = os.path.join(mimic_path, item)
        if os.path.isfile(source_item):
            shutil.copy2(source_item, target_item)

    print(f"Copied contents of '{source_folder}' to '{mimic_path}'.")

if __name__ == "__main__":
    main()
