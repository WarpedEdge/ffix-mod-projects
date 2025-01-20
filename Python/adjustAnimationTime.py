import re
import argparse

def scale_timing(input_file, output_file, scale_factor):
    """
    Scales all timing values in the input file by the specified scale factor.

    :param input_file: Path to the input file (text-based, e.g., .anim, script files).
    :param output_file: Path to save the modified file.
    :param scale_factor: Factor by which to scale timing values.
    """
    with open(input_file, 'r') as file:
        lines = file.readlines()

    # Patterns to match timing values
    time_patterns = [
        r'"time":\s*([0-9\.]+)',  # Matches "time": 2.133333
        r'Wait:\s*Time=([0-9\.]+)'  # Matches Wait: Time=2.133333
    ]

    scaled_lines = []
    for line in lines:
        original_line = line
        for pattern in time_patterns:
            matches = re.finditer(pattern, line)
            for match in matches:
                original_time = float(match.group(1))
                scaled_time = round(original_time * scale_factor, 7)
                line = line.replace(match.group(0), match.group(0).replace(match.group(1), str(scaled_time)))
        scaled_lines.append(line)

    with open(output_file, 'w') as file:
        file.writelines(scaled_lines)

    print(f"File '{input_file}' processed and saved to '{output_file}' with timing scaled by {scale_factor}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scale timing values in an animation or script file.")
    parser.add_argument("input_file", help="Path to the input file (e.g., .anim or script file).")
    parser.add_argument("output_file", help="Path to save the output file.")
    parser.add_argument("scale_factor", type=float, help="Factor by which to scale timing values.")

    args = parser.parse_args()
    scale_timing(args.input_file, args.output_file, args.scale_factor)
