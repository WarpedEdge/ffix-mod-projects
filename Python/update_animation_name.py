import os
import re

# Get the current working directory
current_dir = os.getcwd()

# Loop through all files in the current directory
for filename in os.listdir(current_dir):
    # Process only .txt files
    if filename.endswith(".txt"):
        # Construct the new .anim name from the .txt file name
        anim_name = f"{os.path.splitext(filename)[0]}.anim"

        # Read the content of the file
        with open(filename, "r", encoding="utf-8") as file:
            content = file.read()

        # Use regex to find and replace any .anim file paths
        new_content = re.sub(r"\b\w+\.anim\b", anim_name, content)

        # Save the updated content back to the file
        with open(filename, "w", encoding="utf-8") as file:
            file.write(new_content)

print("File processing complete!")
