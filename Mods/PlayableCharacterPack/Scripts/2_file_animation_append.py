import os


def get_directory_choice(prompt, directories):
    """Helper function to ask user to choose from a list of directories."""
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
    Gathers:
      - The export directory (e.g. NewCast)
      - The source character (e.g. Aria)
      - Reads the Info.txt in that folder to extract MODEL_ANIMATION_NAME.
      - Then, from within the source character's AnimRaw folder,
        allows selection of the target character (e.g. Armarant).
    """
    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    export_dirs = [d for d in os.listdir(parent_dir)
                   if d.endswith("Cast") and os.path.isdir(os.path.join(parent_dir, d))]
    export = get_directory_choice("Select an export directory:", export_dirs)
    if not export:
        return None, None, None, None, None
    export_path = os.path.join(parent_dir, export)

    source_chars = [d for d in os.listdir(export_path)
                    if os.path.isdir(os.path.join(export_path, d))]
    source_character = get_directory_choice("Select a source character:", source_chars)
    if not source_character:
        return None, None, None, None, None
    source_char_path = os.path.join(export_path, source_character)

    # Read Info.txt to extract MODEL_ANIMATION_NAME
    info_file = os.path.join(source_char_path, "Info.txt")
    if not os.path.exists(info_file):
        print(f"Info.txt not found in {source_char_path}")
        return None, None, None, None, None

    model_anim_name = None
    with open(info_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("MODEL_ANIMATION_NAME:"):
                model_anim_name = line.split(":", 1)[1].strip()
                break
    if not model_anim_name:
        print("MODEL_ANIMATION_NAME not found in Info.txt")
        return None, None, None, None, None

    animraw_path = os.path.join(source_char_path, "AnimRaw")
    if not os.path.exists(animraw_path):
        print(f"AnimRaw folder not found in {source_char_path}")
        return None, None, None, None, None
    target_chars = [d for d in os.listdir(animraw_path)
                    if os.path.isdir(os.path.join(animraw_path, d))]
    target_character = get_directory_choice("Select a target character from AnimRaw:", target_chars)
    if not target_character:
        return None, None, None, None, None
    target_path = os.path.join(animraw_path, target_character)

    return export, source_character, target_character, model_anim_name, target_path


def rename_files(model_anim_name, target_path):
    """
    For each file in the target_path, renames it by prepending the model_anim_name.
    For example, "BTL_ATTACK1" becomes "ANH_NPC_F0_OFF_BTL_ATTACK1".
    """
    for filename in os.listdir(target_path):
        file_path = os.path.join(target_path, filename)
        if os.path.isfile(file_path):
            # Debugging: Print the file name before renaming
            print(f"Processing file: {filename}")

            # Make sure no illegal characters exist in the new filename
            new_filename = f"{model_anim_name}_{filename}"

            # Debugging: Print the new filename before renaming
            print(f"Renaming {filename} to {new_filename}")

            new_file_path = os.path.join(target_path, new_filename)

            try:
                # Renaming the file
                os.rename(file_path, new_file_path)
                print(f"Renamed {filename} to {new_filename}")
            except Exception as e:
                print(f"Error renaming file {filename}: {e}")
        else:
            print(f"Skipping {filename} (not a file)")


def main():
    export, source_character, target_character, model_anim_name, target_path = gather_info()
    if not export:
        print("Could not gather necessary info.")
        return
    print(f"Export: {export}")
    print(f"Source Character: {source_character}")
    print(f"Target Character: {target_character}")
    print(f"Model Animation Name: {model_anim_name}")
    print(f"Target Path: {target_path}")
    rename_files(model_anim_name, target_path)


if __name__ == "__main__":
    main()
