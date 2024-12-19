import os

def prompt_for_directory(base_dir, prompt_message):
    """
    Prompts the user to choose a directory from the provided base directory.
    """
    # List directories in the base directory
    directories = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    
    if not directories:
        print(f"No directories found in {base_dir}. Exiting.")
        return None
    
    print(prompt_message)
    for i, dir_name in enumerate(directories, start=1):
        print(f"{i}. {dir_name}")
    
    # Get user selection
    while True:
        try:
            choice = int(input(f"Select a directory (1-{len(directories)}): "))
            if 1 <= choice <= len(directories):
                selected_dir = directories[choice - 1]
                return selected_dir
            else:
                print(f"Invalid choice. Please select a number between 1 and {len(directories)}.")
        except ValueError:
            print("Invalid input. Please enter a number.")

def main():
    # Define the desired order based on suffixes
    order_suffixes = [
        "BTL_IDLE", "BTL_IDLEWEAK", "BTL_HIT", "BTL_HITSTRONG", "BTL_IDLEKO", "BTL_WEAK_STAND", 
        "BTL_KO_WEAK", "BTL_STAND_WEAK", "BTL_WEAK_KO", "BTL_IDLEREADY", "BTL_STAND_READY", 
        "BTL_WEAK_READY", "BTL_READY_DEFEND", "BTL_IDLEDEFEND", "BTL_DEFEND_STAND", "BTL_COVER", 
        "BTL_DODGE", "BTL_FLEE", "BTL_VICTORY", "BTL_VICTORYLOOP", "BTL_READY_ATTACK", "BTL_ATTACKRUN", 
        "BTL_ATTACK1", "BTL_ATTACK2", "BTL_JUMPBACK1", "BTL_JUMPBACK2", "BTL_READY_CAST", "BTL_IDLE_CAST", 
        "BTL_CAST_STAND", "BTL_MOVEFORWARD", "BTL_MOVEBACKWARD", "BTL_ITEM", "BTL_READY_STAND", 
        "BTL_SPECIAL_CAST"
    ]

    base_dir = "Characters"
    
    # Prompt for directory inside 'Characters'
    character_dir = prompt_for_directory(base_dir, "Select a character directory inside 'Characters':")
    if not character_dir:
        return
    
    character_path = os.path.join(base_dir, character_dir)
    
    # Automatically navigate to the 'Mimic' directory inside the selected character directory
    mimic_dir = "Mimic"
    mimic_path = os.path.join(character_path, mimic_dir)

    # Check if the 'Mimic' directory exists
    if not os.path.isdir(mimic_path):
        print(f"The 'Mimic' directory was not found in {character_dir}. Exiting.")
        return
    
    # Prompt for a subdirectory inside 'Mimic'
    sub_dir = prompt_for_directory(mimic_path, f"Select a directory inside 'Mimic' of {character_dir}:")
    if not sub_dir:
        return
    
    sub_dir_path = os.path.join(mimic_path, sub_dir)

    # List all .txt files in the subdirectory inside 'Mimic'
    txt_files = [f for f in os.listdir(sub_dir_path) if f.endswith(".txt")]

    # Create a list of filenames without the .txt extension
    filenames_without_extension = [os.path.splitext(file)[0] for file in txt_files]

    # Create a result list ordered by the suffix list
    result = []
    for suffix in order_suffixes:
        for filename in filenames_without_extension:
            if filename.endswith(suffix):  # Match filenames that end with the suffix
                result.append(filename)
                break  # Ensure each suffix is added only once

    # Print all filenames in the desired order
    for file in result:
        print(file)

if __name__ == "__main__":
    main()
