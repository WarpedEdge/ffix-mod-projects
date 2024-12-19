import os

def extract_animation_name(character_info_file):
    """Extracts the ANIMATION_NAME value from a character information file."""
    animation_name = None
    with open(character_info_file, "r") as file:
        for line in file:
            if line.startswith("ANIMATION_NAME:"):
                animation_name = line.split(":", 1)[1].strip()
                break
    return animation_name

def prepend_animation_name_to_filenames(target_dir, animation_name):
    """Prepends the animation name to all .txt filenames in the target directory."""
    if not os.path.exists(target_dir):
        print(f"Error: The directory '{target_dir}' does not exist.")
        return

    # Strip trailing underscores from the animation name
    animation_name = animation_name.rstrip("_")

    for file_name in os.listdir(target_dir):
        if file_name.endswith(".txt"):
            new_file_name = f"{animation_name}_{file_name}"
            os.rename(
                os.path.join(target_dir, file_name),
                os.path.join(target_dir, new_file_name)
            )
            print(f"Renamed: {file_name} -> {new_file_name}")

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

    # Extract the ANIMATION_NAME
    animation_name = extract_animation_name(selected_file)
    if not animation_name:
        print(f"Error: Could not find 'ANIMATION_NAME' in {selected_file}.")
        return

    print(f"Extracted ANIMATION_NAME: {animation_name}")

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

    # Prepend the animation name to all .txt filenames in the selected Mimic subfolder
    prepend_animation_name_to_filenames(target_dir, animation_name)

if __name__ == "__main__":
    main()
