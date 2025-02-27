import os

def get_file_choice(directory):
    print(f"Choose a file from the {directory} directory:")
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    for idx, file in enumerate(files, 1):
        print(f"{idx}. {file}")
    
    choice = int(input(f"Enter the number of the file you want to copy from: "))
    return os.path.join(directory, files[choice - 1])

def get_directory_choice(base_directory):
    print(f"Choose a directory inside {base_directory}:")
    directories = [d for d in os.listdir(base_directory) if os.path.isdir(os.path.join(base_directory, d))]
    for idx, dir in enumerate(directories, 1):
        print(f"{idx}. {dir}")
    
    choice = int(input(f"Enter the number of the directory you want to copy into: "))
    return os.path.join(base_directory, directories[choice - 1])

def get_mimic_subfolder_choice(mimic_directory):
    print(f"Choose a subfolder inside {mimic_directory}:")
    subdirectories = [d for d in os.listdir(mimic_directory) if os.path.isdir(os.path.join(mimic_directory, d))]
    for idx, subdir in enumerate(subdirectories, 1):
        print(f"{idx}. {subdir}")
    
    choice = int(input(f"Enter the number of the subfolder you want to loop through: "))
    return os.path.join(mimic_directory, subdirectories[choice - 1])

def copy_bone_hierarchy(src_file, dest_file):
    with open(src_file, 'r') as src:
        src_lines = src.readlines()
    
    with open(dest_file, 'r') as dest:
        dest_lines = dest.readlines()

    # Find the BoneHierarchy sections in both files
    src_bone_hierarchy_index = next((i for i, line in enumerate(src_lines) if line.startswith('BoneHierarchy:')), None)
    dest_bone_hierarchy_index = next((i for i, line in enumerate(dest_lines) if line.startswith('BoneHierarchy:')), None)

    if src_bone_hierarchy_index is not None and dest_bone_hierarchy_index is not None:
        # Copy the bone hierarchy from the source file into the destination file
        dest_lines = dest_lines[:dest_bone_hierarchy_index + 1] + src_lines[src_bone_hierarchy_index + 1:]

        # Save the modified destination file
        with open(dest_file, 'w') as dest:
            dest.writelines(dest_lines)
        print(f"Successfully copied bone hierarchy into {dest_file}")
    else:
        print("Could not find BoneHierarchy in both files.")

def main():
    repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # Assuming script is at HEAD of repo
    merges_directory = os.path.join(repo_path, 'Merges')
    characters_directory = os.path.join(repo_path, 'Characters')

    # Step 1: Get the source file from Merges directory
    merge_file = get_file_choice(merges_directory)

    # Step 2: Get the destination directory inside Characters
    character_dir = get_directory_choice(characters_directory)  # Choose a character directory

    # Step 3: Directly set the Mimic folder path inside the chosen character directory
    mimic_folder = os.path.join(character_dir, 'Mimic')  # Always choose the Mimic folder

    if not os.path.exists(mimic_folder):
        print(f"The {mimic_folder} directory does not exist. Exiting...")
        return

    # Step 4: Get the subfolder inside Mimic to loop through
    mimic_subfolder = get_mimic_subfolder_choice(mimic_folder)

    # Step 5: Loop through all files in the selected Mimic subfolder and copy the bone hierarchy
    for file_name in os.listdir(mimic_subfolder):
        mimic_file_path = os.path.join(mimic_subfolder, file_name)
        
        if os.path.isfile(mimic_file_path):  # Ensure it's a file
            print(f"\nProcessing file: {file_name}")
            copy_bone_hierarchy(merge_file, mimic_file_path)

if __name__ == "__main__":
    main()
