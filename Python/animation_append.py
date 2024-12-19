import os

# Prompt the user for the prefix
prefix = input("Enter the prefix to prepend to the filenames: ")

# Get the current working directory
current_dir = os.getcwd()

# Loop through all files in the directory
for filename in os.listdir(current_dir):
    # Check if the item is a file
    if os.path.isfile(filename):
        # Construct the new filename
        new_filename = f"{prefix}{filename}"
        # Rename the file
        os.rename(filename, new_filename)

print("Renaming complete!")
