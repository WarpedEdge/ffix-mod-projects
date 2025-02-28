import os
import fnmatch


def get_directory_choice(prompt, directories):
    """Helper function to let the user choose a directory (or file) from a list."""
    if not directories:
        print("No matching items found.")
        return None
    print(prompt)
    for i, item in enumerate(directories, 1):
        print(f"{i}. {item}")
    while True:
        choice = input("Enter the number of your choice: ")
        if choice.isdigit():
            choice = int(choice)
            if 1 <= choice <= len(directories):
                return directories[choice - 1]
        print("Invalid choice. Please try again.")


def gather_phase3_info():
    """
    1. Ask for the Cast directory (e.g. NewCast) from one level up.
    2. Ask for the target directory within that Cast (e.g. Aria). (Aria's folder contains BoneMerges and AnimRaw.)
    3. In Aria's BoneMerges folder, list .txt files (e.g. Armarant.txt) and let the user choose one.
       Read its entire contents (preserving line breaks) as the new bone hierarchy.
    4. In Aria's AnimRaw folder, list available character folders and let the user choose one.
    Returns: new_bone_hierarchy (str), animraw_character_path (str)
    """
    # Get the parent directory (one level up from Scripts folder)
    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # 1. List Cast directories (ending with "Cast")
    cast_dirs = [d for d in os.listdir(parent_dir) if
                 fnmatch.fnmatch(d, "*Cast") and os.path.isdir(os.path.join(parent_dir, d))]
    cast_dir = get_directory_choice("Select a Cast directory:", cast_dirs)
    if not cast_dir:
        return None, None
    cast_path = os.path.join(parent_dir, cast_dir)

    # 2. Choose target directory within the cast (e.g. Aria)
    target_dirs = [d for d in os.listdir(cast_path) if os.path.isdir(os.path.join(cast_path, d))]
    target_dir = get_directory_choice(f"Select a target directory from {cast_dir}:", target_dirs)
    if not target_dir:
        return None, None
    target_path = os.path.join(cast_path, target_dir)

    # 3. In target folder, go into BoneMerges folder and choose a .txt file
    bone_merges_path = os.path.join(target_path, "BoneMerges")
    if not os.path.exists(bone_merges_path):
        print(f"Error: BoneMerges folder not found in {target_path}")
        return None, None
    bone_merge_files = [f for f in os.listdir(bone_merges_path) if
                        f.lower().endswith(".txt") and os.path.isfile(os.path.join(bone_merges_path, f))]
    bone_merge_file = get_directory_choice(f"Select a BoneMerges file from {target_dir}/BoneMerges:", bone_merge_files)
    if not bone_merge_file:
        return None, None
    bone_merge_file_path = os.path.join(bone_merges_path, bone_merge_file)
    try:
        with open(bone_merge_file_path, "r", encoding="utf-8") as f:
            new_bone_hierarchy = f.read()
    except Exception as e:
        print(f"Error reading {bone_merge_file_path}: {e}")
        return None, None

    # 4. In target folder, go into AnimRaw folder and choose a character folder
    animraw_path = os.path.join(target_path, "AnimRaw")
    if not os.path.exists(animraw_path):
        print(f"Error: AnimRaw folder not found in {target_path}")
        return None, None
    animraw_chars = [d for d in os.listdir(animraw_path) if os.path.isdir(os.path.join(animraw_path, d))]
    animraw_char = get_directory_choice(f"Select a character folder from {target_dir}/AnimRaw:", animraw_chars)
    if not animraw_char:
        return None, None
    animraw_char_path = os.path.join(animraw_path, animraw_char)

    return new_bone_hierarchy, animraw_char_path


def update_bone_hierarchy(new_bone_hierarchy, character_folder_path):
    """
    Loops through each file in the chosen character folder (e.g., AnimRaw/Armarant)
    and replaces the BoneHierarchy section with the new bone hierarchy text.
    The updated content will include one "BoneHierarchy:" line followed by the new bone hierarchy (preserving line breaks).
    """
    for filename in os.listdir(character_folder_path):
        file_path = os.path.join(character_folder_path, filename)
        if os.path.isfile(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()

                # Find the index of the line that starts with "BoneHierarchy:"
                bone_index = None
                for i, line in enumerate(lines):
                    if line.strip().startswith("BoneHierarchy:"):
                        bone_index = i
                        break

                if bone_index is not None:
                    # Preserve lines before the BoneHierarchy: section
                    new_lines = lines[:bone_index]
                    # If the last preserved line is exactly "BoneHierarchy:", remove it to avoid duplication.
                    if new_lines and new_lines[-1].strip() == "BoneHierarchy:":
                        new_lines.pop()
                    # Append one instance of "BoneHierarchy:" and the new hierarchy
                    new_lines.append("BoneHierarchy:\n")
                    new_lines.append(new_bone_hierarchy.rstrip("\n") + "\n")
                else:
                    # If no BoneHierarchy: line was found, append the new section at the end.
                    new_lines = lines[:]
                    new_lines.append("\nBoneHierarchy:\n")
                    new_lines.append(new_bone_hierarchy.rstrip("\n") + "\n")

                with open(file_path, "w", encoding="utf-8") as f:
                    f.writelines(new_lines)
                print(f"Updated BoneHierarchy in {filename}")
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
        else:
            print(f"Skipping {filename} (not a file)")


def main():
    new_bone_hierarchy, animraw_char_path = gather_phase3_info()
    if new_bone_hierarchy is None or animraw_char_path is None:
        print("Error gathering necessary info. Exiting.")
        return
    print("Bone merge file contents loaded.")
    print(f"Processing files in: {animraw_char_path}")
    update_bone_hierarchy(new_bone_hierarchy, animraw_char_path)


if __name__ == "__main__":
    main()
