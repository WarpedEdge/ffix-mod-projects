import os
import fnmatch


def get_directory_choice(prompt, directories):
    """Helper function to let the user choose a directory from a list."""
    if not directories:
        print("No matching directories found.")
        return None
    print(prompt)
    for i, d in enumerate(directories, 1):
        print(f"{i}. {d}")
    while True:
        choice = input("Enter the number of your choice: ")
        if choice.isdigit():
            choice = int(choice)
            if 1 <= choice <= len(directories):
                return directories[choice - 1]
        print("Invalid choice. Please try again.")


def gather_info():
    """
    Step 1: Ask for the Cast directory (e.g. NewCast)
    Step 2: Ask for the target directory within that Cast (e.g. Aria)
       -> This folder contains an Info.txt with the MODEL_NAME variable.
    Step 3: Extract MODEL_NAME from Aria's Info.txt.
    Step 4: Go into Aria's AnimRaw folder and choose a character folder (e.g. Armarant).
    Step 5: Ask for the mod folder name (e.g. WarpedEdgeMod) to prepend to ExportPath.
    Returns the MODEL_NAME, character_folder_path, and mod_folder_name.
    """
    # Calculate the parent directory (one level up from the current Scripts folder)
    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # List Cast directories (those ending with "Cast")
    cast_dirs = [d for d in os.listdir(parent_dir) if
                 fnmatch.fnmatch(d, "*Cast") and os.path.isdir(os.path.join(parent_dir, d))]
    cast_dir = get_directory_choice("Select a Cast directory:", cast_dirs)
    if not cast_dir:
        return None, None, None
    cast_path = os.path.join(parent_dir, cast_dir)

    # Choose the target directory (e.g. Aria) inside the selected Cast directory
    target_dirs = [d for d in os.listdir(cast_path) if os.path.isdir(os.path.join(cast_path, d))]
    target_dir = get_directory_choice(f"Select a target directory from {cast_dir}:", target_dirs)
    if not target_dir:
        return None, None, None
    target_path = os.path.join(cast_path, target_dir)

    # Extract MODEL_NAME from target directory's Info.txt (e.g., Aria/Info.txt)
    info_file = os.path.join(target_path, "Info.txt")
    if not os.path.exists(info_file):
        print(f"Error: Info.txt not found in {target_path}")
        return None, None, None
    model_name = None
    with open(info_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("MODEL_NAME:"):
                model_name = line.split(":", 1)[1].strip()
                break
    if not model_name:
        print("Error: MODEL_NAME not found in Info.txt")
        return None, None, None
    print(f"Extracted MODEL_NAME: {model_name}")

    # Now, within target_path, go into its AnimRaw folder
    animraw_path = os.path.join(target_path, "AnimRaw")
    if not os.path.exists(animraw_path):
        print(f"Error: AnimRaw folder not found in {target_path}")
        return None, None, None
    # Let the user choose a character folder from within AnimRaw (e.g., Armarant)
    character_folders = [d for d in os.listdir(animraw_path) if os.path.isdir(os.path.join(animraw_path, d))]
    character_folder = get_directory_choice(f"Select a character folder from {target_dir}/AnimRaw:", character_folders)
    if not character_folder:
        return None, None, None
    character_folder_path = os.path.join(animraw_path, character_folder)

    # Ask for the mod folder name
    mod_folder_name = input("What is your mod folder name? (default: MyMod): ").strip()
    if not mod_folder_name:
        mod_folder_name = "MyMod"

    return model_name, character_folder_path, mod_folder_name


def update_export_paths(model_name, character_folder_path, mod_folder_name):
    """
    Loops through each file in the character folder.
    For each file, it assumes the file name is something like:
       ANH_NPC_F1_OFF_BTL_ATTACK1.txt
    It constructs a new animation file name by replacing the extension with .anim.
    Then it creates a new ExportPath line:
       ExportPath:{mod_folder_name}/StreamingAssets/Assets/Resources/Animations/{model_name}/{new_animation_file}
    and replaces the existing ExportPath line in the file.
    """
    for filename in os.listdir(character_folder_path):
        file_path = os.path.join(character_folder_path, filename)
        if os.path.isfile(file_path):
            # Derive the new animation file name (replace .txt with .anim)
            base_name = os.path.splitext(filename)[0]
            new_anim_file = base_name + ".anim"
            new_export_line = f"ExportPath:{mod_folder_name}/StreamingAssets/Assets/Resources/Animations/{model_name}/{new_anim_file}\n"

            # Read the file and replace the ExportPath line
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                updated_lines = []
                replaced = False
                for line in lines:
                    if line.startswith("ExportPath:"):
                        updated_lines.append(new_export_line)
                        replaced = True
                    else:
                        updated_lines.append(line)
                # If no ExportPath line was found, append it
                if not replaced:
                    updated_lines.append(new_export_line)

                with open(file_path, "w", encoding="utf-8") as f:
                    f.writelines(updated_lines)
                print(f"Updated {filename} with new ExportPath: {new_export_line.strip()}")
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
        else:
            print(f"Skipping {filename} (not a file)")


def main():
    model_name, character_folder_path, mod_folder_name = gather_info()
    if not model_name or not character_folder_path or not mod_folder_name:
        print("Error gathering necessary information. Exiting.")
        return
    print(f"Using MODEL_NAME: {model_name}")
    print(f"Mod folder name: {mod_folder_name}")
    print(f"Processing files in: {character_folder_path}")
    update_export_paths(model_name, character_folder_path, mod_folder_name)


if __name__ == "__main__":
    main()
