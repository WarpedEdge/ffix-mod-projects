import subprocess
import os

# Define the order of scripts to execute
scripts = [
    "Python/phase0_copy_export.py",
    "Python/phase1_file_animation_append.py",
    "Python/phase2_adjust_export_path_line.py",
    "Python/phase3_bone_replace.py",
    "Python/phase4_combine_animations.py",
    "Python/print_animation.py",
]

# Function to execute a script
def run_script(script):
    try:
        print(f"Running {script}...")
        result = subprocess.run(["python", script], check=True)
        print(f"{script} completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running {script}: {e}")
        exit(1)
    except FileNotFoundError:
        print(f"Script {script} not found in the directory.")
        exit(1)

# Main execution loop
if __name__ == "__main__":
    current_directory = os.getcwd()
    print(f"Current working directory: {current_directory}")

    for script in scripts:
        run_script(script)

    print("All scripts executed successfully.")