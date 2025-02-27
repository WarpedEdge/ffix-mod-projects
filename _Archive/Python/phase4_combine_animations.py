import os

def prompt_for_directory(base_dir):
    """
    Prompts the user to choose a directory from the provided base directory.
    """
    # List directories in the base directory
    print(f"Please select a directory in {base_dir}:")
    dirs = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    
    # If there are no directories found, exit
    if not dirs:
        print(f"No directories found in {base_dir}. Exiting.")
        exit()

    for i, dir in enumerate(dirs):
        print(f"{i + 1}: {dir}")
    
    # Get user input to select the directory
    while True:
        try:
            choice = int(input("Enter the number corresponding to the directory: ")) - 1
            if 0 <= choice < len(dirs):
                return os.path.join(base_dir, dirs[choice])
            else:
                print("Invalid choice. Please try again.")
        except ValueError:
            print("Please enter a valid number.")

def extract_animation_and_exportpath(input_dir, output_file):
    """
    Extracts the Animation and ExportPath lines from each file in the specified directory
    and writes the result into the output file.
    """
    with open(output_file, 'w') as out_file:
        for filename in os.listdir(input_dir):
            file_path = os.path.join(input_dir, filename)
            
            # Skip directories, only process files
            if os.path.isdir(file_path):
                continue
            
            # Open each file to extract relevant lines
            with open(file_path, 'r') as in_file:
                lines = in_file.readlines()
                animation_lines = []
                exportpath_lines = []
                
                # Collect Animation and ExportPath lines
                for line in lines:
                    if line.startswith('Animation:'):
                        animation_lines.append(line.strip())
                    elif line.startswith('ExportPath:'):
                        exportpath_lines.append(line.strip())
                
                # Create pairs of Animation and ExportPath lines
                for anim, export in zip(animation_lines, exportpath_lines):
                    out_file.write(f"{anim}\n")
                    out_file.write(f"{export}\n")
                    
    print(f"Data successfully extracted to {output_file}")

def main():
    # Starting point: 'Characters' directory
    characters_dir = "Characters"  # Adjust this to your actual path
    
    # Prompt user to select a character directory
    selected_char_dir = prompt_for_directory(characters_dir)
    
    # Next, look inside the 'mimic' folder inside the selected character directory
    mimic_dir = os.path.join(selected_char_dir, "mimic")
    
    if not os.path.isdir(mimic_dir):
        print(f"No 'mimic' folder found in {selected_char_dir}. Exiting.")
        exit()
    
    # Prompt user to select a subdirectory inside 'mimic'
    selected_mimic_dir = prompt_for_directory(mimic_dir)
    
    # Define the output file where data will be written (inside the mimic directory)
    output_file = os.path.join(selected_mimic_dir, "output.txt")
    
    # Extract animation and exportpath pairs and save them to the output file
    extract_animation_and_exportpath(selected_mimic_dir, output_file)

if __name__ == "__main__":
    main()
