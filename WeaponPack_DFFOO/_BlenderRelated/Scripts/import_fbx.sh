import bpy
import os

main_dir = "C:/Path/To/YourMainFolder"  # <-- Change this
spacing = 2  # Reduced spacing between models
models_per_row = 5  # Adjust this to control row length

index = 0

for subfolder in os.listdir(main_dir):
    subfolder_path = os.path.join(main_dir, subfolder)

    if os.path.isdir(subfolder_path):
        for file in os.listdir(subfolder_path):
            if file.lower().endswith(".fbx"):
                fbx_path = os.path.join(subfolder_path, file)

                # Import the FBX
                bpy.ops.import_scene.fbx(filepath=fbx_path)

                # Calculate grid position
                row = index // models_per_row
                col = index % models_per_row
                x_offset = col * spacing
                y_offset = row * spacing

                # Move all newly imported objects
                for obj in bpy.context.selected_objects:
                    obj.location.x += x_offset
                    obj.location.y += y_offset

                index += 1
                print(f"Imported: {fbx_path} at ({x_offset}, {y_offset})")
                break  # Only take the first .fbx per subfolder
