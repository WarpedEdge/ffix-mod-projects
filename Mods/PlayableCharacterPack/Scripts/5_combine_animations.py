import os
import fnmatch


def get_directory_choice(prompt, items):
    """Helper function to let the user choose an item from a list."""
    if not items:
        print("No matching items found.")
        return None
    print(prompt)
    for i, item in enumerate(items, 1):
        print(f"{i}. {item}")
    while True:
        choice = input("Enter the number of your choice: ")
        if choice.isdigit():
            choice = int(choice)
            if 1 <= choice <= len(items):
                return items[choice - 1]
        print("Invalid choice. Please try again.")


def gather_info():
    """
    Prompts for:
      1. Cast directory (e.g. NewCast) from one level up.
      2. Target directory within that Cast (e.g. Aria).
      3. Then, from inside Aria's AnimRaw folder, the character folder (e.g. Armarant).
    Returns the full path of the chosen character folder.
    """
    # Get the parent directory (one level up from the Scripts folder)
    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # List Cast directories (directories ending with "Cast")
    cast_dirs = [d for d in os.listdir(parent_dir)
                 if fnmatch.fnmatch(d, "*Cast") and os.path.isdir(os.path.join(parent_dir, d))]
    cast_dir = get_directory_choice("Select a Cast directory:", cast_dirs)
    if not cast_dir:
        return None
    cast_path = os.path.join(parent_dir, cast_dir)

    # Choose target directory (e.g. Aria) within the chosen Cast
    target_dirs = [d for d in os.listdir(cast_path)
                   if os.path.isdir(os.path.join(cast_path, d))]
    target_dir = get_directory_choice(f"Select a target directory from {cast_dir}:", target_dirs)
    if not target_dir:
        return None
    target_path = os.path.join(cast_path, target_dir)

    # Go into AnimRaw folder inside the target directory
    animraw_path = os.path.join(target_path, "AnimRaw")
    if not os.path.exists(animraw_path):
        print(f"AnimRaw folder not found in {target_path}")
        return None

    # Choose a character folder from within AnimRaw (e.g. Armarant)
    char_folders = [d for d in os.listdir(animraw_path) if os.path.isdir(os.path.join(animraw_path, d))]
    char_folder = get_directory_choice(f"Select a character folder from {target_dir}/AnimRaw:", char_folders)
    if not char_folder:
        return None
    char_folder_path = os.path.join(animraw_path, char_folder)
    return char_folder_path


def combine_animations(character_folder_path):
    """
    Loops through each file in the character folder and creates a combined_animations.txt.
    It does the following:
      - For every file, extracts lines starting with "Animation:" or "ExportPath:" (ignoring lines starting with "//")
      - From the first file processed, it also extracts once:
            * DeleteThisOnSuccess:
            * Reverse:
            * FrameRate:
            * And the entire block starting with BoneHierarchy: (all lines until the end)
      - The combined file contains all the Animation/ExportPath lines first (each on its own line),
        then a blank line, then the additional settings block.
    """
    animation_lines = []
    additional_settings = []
    first_file_processed = False

    # Process files in sorted order for consistency.
    for filename in sorted(os.listdir(character_folder_path)):
        file_path = os.path.join(character_folder_path, filename)
        if os.path.isfile(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()

            # Extract Animation: and ExportPath: lines (ignore comment lines starting with "//")
            for line in lines:
                stripped = line.strip()
                if (stripped.startswith("Animation:") or stripped.startswith(
                        "ExportPath:")) and not stripped.startswith("//"):
                    animation_lines.append(stripped)

            # For the first file only, extract the additional settings block
            if not first_file_processed:
                delete_line = None
                reverse_line = None
                framerate_line = None
                bone_block = []
                in_bone_block = False
                for line in lines:
                    stripped = line.strip()
                    if stripped.startswith("//"):
                        continue
                    if stripped.startswith("DeleteThisOnSuccess:"):
                        delete_line = stripped
                    elif stripped.startswith("Reverse:"):
                        reverse_line = stripped
                    elif stripped.startswith("FrameRate:"):
                        framerate_line = stripped
                    elif stripped.startswith("BoneHierarchy:"):
                        in_bone_block = True
                        # Add the BoneHierarchy: line without modification
                        bone_block.append("BoneHierarchy:")
                    elif in_bone_block:
                        # Append all lines in the bone hierarchy block (preserve blank lines)
                        bone_block.append(line.rstrip("\n"))
                if delete_line:
                    additional_settings.append(delete_line)
                if reverse_line:
                    additional_settings.append(reverse_line)
                if framerate_line:
                    additional_settings.append(framerate_line)
                if bone_block:
                    bone_block_str = "\n".join(bone_block)
                    additional_settings.append(bone_block_str)
                first_file_processed = True

    # Write combined file
    combined_file_path = os.path.join(character_folder_path, "combined_animations.txt")
    try:
        with open(combined_file_path, "w", encoding="utf-8") as out_file:
            for line in animation_lines:
                out_file.write(line + "\n")
            out_file.write("\n")  # blank line separating sections
            for setting in additional_settings:
                out_file.write(setting + "\n")
        print(f"Combined animations file created at: {combined_file_path}")
    except Exception as e:
        print(f"Error writing combined file: {e}")


def main():
    char_folder_path = gather_info()
    if not char_folder_path:
        print("Error gathering target folder. Exiting.")
        return
    print(f"Processing character folder: {char_folder_path}")
    combine_animations(char_folder_path)


if __name__ == "__main__":
    main()
