import os

def extract_model_name(character_info_file):
    """Extracts the MODEL_NAME value from a character information file."""
    model_name = None
    with open(character_info_file, "r") as file:
        for line in file:
            if line.startswith("MODEL_NAME:"):
                model_name = line.split(":", 1)[1].strip()
                break
    return model_name

def update_export_path(target_dir, model_name):
    """Updates the ExportPath in all .txt files within the target directory."""
    for file_name in os.listdir(target_dir):
        if file_name.endswith(".txt"):
            file_path = os.path.join(target_dir, file_name)
            new_lines = []

            with open(file_path, "r") as file:
                for line in file:
                    if line.startswith("ExportPath:"):
                        # Modify the ExportPath line
                        original_path = line.split(":", 1)[1].strip()
                        new_path = f"WarpedEdgeMod/StreamingAssets/Assets/Resources/Animations/{model_name}/{os.path.splitext(file_name)[0]}.anim"
                        new_lines.append(f"ExportPath:{new_path}\n")
                    else:
                        new_lines.append(line)
            
            # Write the updated content back to the file
            with open(file_path, "w") as file:
                file.writelines(new_lines)

            print(f"Updated: {file_name}")

def main():
    # Navigate to _CharacterInformation directory
    char_info_dir = "_CharacterInformation"
    if not os.path.exists(char_info_dir):
        print(f"Error: '{char_info_dir}' directory not found.")
        return

    # Prompt the user to select a character file
    char_files = [f for f in os.listdir(char_info_dir) if f.endswith(".txt")]
    if not char_files:
        print("Error: No character files found in '_CharacterInformation'.")
        return

    print("Select a character file:")
    for i, file_name in enumerate(char_files):
        print(f"{i + 1}. {file_name}")
    
    try:
        selection = int(input("Enter the number of the character file: ")) - 1
        if selection < 0 or selection >= len(char_files):
            raise ValueError("Invalid selection.")
    except ValueError as e:
        print(f"Error: {e}")
        return

    selected_file = os.path.join(char_info_dir, char_files[selection])
    print(f"Selected character file: {selected_file}")

    # Extract the MODEL_NAME
    model_name = extract_model_name(selected_file)
    if not model_name:
        print(f"Error: Could not find 'MODEL_NAME' in {selected_file}.")
        return

    print(f"Extracted MODEL_NAME: {model_name}")

    # Prompt the user to select the target character directory
    characters_dir = "Characters"
    if not os.path.exists(characters_dir):
        print(f"Error: '{characters_dir}' directory not found.")
        return

    character_dirs = [d for d in os.listdir(characters_dir) if os.path.isdir(os.path.join(characters_dir, d))]
    if not character_dirs:
        print("Error: No character directories found in 'Characters'.")
        return

    print("Select a character directory:")
    for i, dir_name in enumerate(character_dirs):
        print(f"{i + 1}. {dir_name}")
    
    try:
        selection = int(input("Enter the number of the character directory: ")) - 1
        if selection < 0 or selection >= len(character_dirs):
            raise ValueError("Invalid selection.")
    except ValueError as e:
        print(f"Error: {e}")
        return

    selected_character_dir = character_dirs[selection]
    mimic_dir = os.path.join(characters_dir, selected_character_dir, "Mimic")
    if not os.path.exists(mimic_dir):
        print(f"Error: The 'Mimic' directory for '{selected_character_dir}' does not exist.")
        return

    # Prompt the user to select a Mimic subfolder
    mimic_subfolders = [d for d in os.listdir(mimic_dir) if os.path.isdir(os.path.join(mimic_dir, d))]
    if not mimic_subfolders:
        print(f"Error: No subfolders found in '{mimic_dir}'.")
        return

    print("Select a Mimic subfolder:")
    for i, subfolder in enumerate(mimic_subfolders):
        print(f"{i + 1}. {subfolder}")
    
    try:
        mimic_selection = int(input("Enter the number of the Mimic subfolder: ")) - 1
        if mimic_selection < 0 or mimic_selection >= len(mimic_subfolders):
            raise ValueError("Invalid selection.")
    except ValueError as e:
        print(f"Error: {e}")
        return

    selected_mimic_subfolder = mimic_subfolders[mimic_selection]
    target_dir = os.path.join(mimic_dir, selected_mimic_subfolder)
    print(f"Target Mimic subfolder: {target_dir}")

    # Update ExportPath in all .txt files
    update_export_path(target_dir, model_name)

if __name__ == "__main__":
    main()
