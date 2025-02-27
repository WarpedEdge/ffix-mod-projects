import os

def main():
    # Determine the merges folder, going up 4 directories
    current_dir = os.getcwd()
    merges_dir = os.path.abspath(os.path.join(current_dir, "../../../../merges"))

    # Verify the merges folder exists
    if not os.path.exists(merges_dir):
        print(f"Error: Merges directory does not exist at {merges_dir}")
        return

    # List all .txt files in the merges directory
    merge_files = [f for f in os.listdir(merges_dir) if f.endswith(".txt")]
    
    if not merge_files:
        print("No .txt files found in the merges folder.")
        return

    # Prompt the user to select a file
    print("Select a file from the merges folder:")
    for idx, file in enumerate(merge_files, start=1):
        print(f"[{idx}] {file}")

    try:
        choice = int(input("Enter the number of your choice: "))
        selected_file = merge_files[choice - 1]
    except (ValueError, IndexError):
        print("Invalid selection. Exiting.")
        return

    selected_file_path = os.path.join(merges_dir, selected_file)

    # Read the contents of the selected file
    with open(selected_file_path, "r", encoding="utf-8") as f:
        merge_content = f.read()

    # Extract the content after 'BoneHierarchy:'
    if "BoneHierarchy:" not in merge_content:
        print(f"Error: 'BoneHierarchy:' not found in {selected_file}.")
        return

    bone_hierarchy_content = merge_content.split("BoneHierarchy:", 1)[1]  # Keep trailing whitespace intact

    # Process all .txt files in the current directory
    for file in os.listdir(current_dir):
        if file.endswith(".txt"):
            file_path = os.path.join(current_dir, file)

            with open(file_path, "r", encoding="utf-8") as f:
                file_content = f.read()

            # Check for 'BoneHierarchy:' in the file
            if "BoneHierarchy:" not in file_content:
                print(f"Warning: 'BoneHierarchy:' not found in {file}. Skipping.")
                continue

            # Split and replace content after 'BoneHierarchy:'
            before_bone_hierarchy = file_content.split("BoneHierarchy:", 1)[0]
            new_file_content = f"{before_bone_hierarchy}BoneHierarchy:{bone_hierarchy_content}"

            # Write the updated content back to the file
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_file_content)

            print(f"Updated: {file}")

    print("Processing complete!")

if __name__ == "__main__":
    main()
