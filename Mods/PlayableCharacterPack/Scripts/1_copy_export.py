import os
import fnmatch
import shutil


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


def gather_sources_and_targets():
    """Finds *Cast directories one level up and lets user choose source and target directories."""
    # Let's debug and display the current directory first
    current_dir = os.path.dirname(__file__)
    print(f"Current script directory: {current_dir}")

    # Now calculate the parent directory (going up one level)
    parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
    print(f"Parent directory: {parent_dir}")  # Display to ensure correctness

    # Get the *Cast directories (source and target)
    cast_dirs = [d for d in os.listdir(parent_dir) if
                 fnmatch.fnmatch(d, "*Cast") and os.path.isdir(os.path.join(parent_dir, d))]

    # Select source export and character
    source_export = get_directory_choice("Select a source export directory:", cast_dirs)
    if not source_export:
        return None, None, None, None  # Return early if no valid source is selected

    export_path = os.path.join(parent_dir, source_export)
    character_dirs = [d for d in os.listdir(export_path) if os.path.isdir(os.path.join(export_path, d))]

    source_character = get_directory_choice(f"Select a character from {source_export}:", character_dirs)
    if not source_character:
        return None, None, None, None  # Return early if no valid source character is selected

    # Select target export and character
    target_export = get_directory_choice("Select a target export directory:", cast_dirs)
    if not target_export:
        return None, None, None, None  # Return early if no valid target is selected

    export_path = os.path.join(parent_dir, target_export)
    character_dirs = [d for d in os.listdir(export_path) if os.path.isdir(os.path.join(export_path, d))]

    target_character = get_directory_choice(f"Select a character from {target_export}:", character_dirs)
    if not target_character:
        return None, None, None, None  # Return early if no valid target character is selected

    return source_export, source_character, target_export, target_character


def copy_files(source_export, source_character, target_export, target_character):
    """Copies files from the source character's MemoriaExportAnim to the target character's AnimRaw."""

    # Correctly calculate the source and target directories
    # Go up one more level from the parent_dir for the actual directories
    source_dir = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")), source_export,
                              source_character, "MemoriaExportAnim")
    target_dir = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")), target_export,
                              target_character, "AnimRaw", source_character)

    # Check if the source directory exists
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} does not exist.")
        return

    # Create the target directory if it does not exist
    os.makedirs(target_dir, exist_ok=True)

    # Loop through all files in the source MemoriaExportAnim directory
    for filename in os.listdir(source_dir):
        source_file = os.path.join(source_dir, filename)
        target_file = os.path.join(target_dir, filename)

        # If it's a file (not a subdirectory), copy it
        if os.path.isfile(source_file):
            print(f"Copying {filename} to {target_file}")
            shutil.copy(source_file, target_file)
        else:
            print(f"Skipping {filename} (not a file)")

    print("File copy complete.")


# Example usage
source_export, source_character, target_export, target_character = gather_sources_and_targets()

if source_export and source_character and target_export and target_character:
    # Call the copy function after selecting the source and target
    copy_files(source_export, source_character, target_export, target_character)
else:
    print("Selection was not completed successfully.")
