#!/usr/bin/env python3
"""
AnimationConvert.py

A small utility to inline JSON-like animation keyframes for
properties localRotation, localPosition, and localScale.
Also allows optional override of frameRate value.

Usage:
    python3 AnimationConvert.py <input_file.anim> [frameRate]

Output:
    Writes revised_<input_file.anim> in the same directory.
"""
import sys
import re
from pathlib import Path

def inline_keyframes(text):
    pattern = re.compile(
        r'^(?P<indent>\s*)"(?P<prop>localRotation|localPosition|localScale)"\s*:\s*\[\s*(?P<content>[\s\S]*?)\s*\]',
        flags=re.MULTILINE
    )

    def repl(match):
        indent = match.group('indent')
        prop = match.group('prop')
        content = match.group('content')
        objects = re.findall(r'\{[^}]*\}', content, flags=re.DOTALL)
        lines = [f"{indent}    {' '.join(obj.split())}" for obj in objects]
        return f'{indent}"{prop}": [\n' + ",\n".join(lines) + f'\n{indent}]'

    return pattern.sub(repl, text)

def override_framerate(text, new_rate):
    return re.sub(
        r'"frameRate"\s*:\s*\d+',
        f'"frameRate": {new_rate}',
        text,
        count=1
    )

def main():
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        print(f"Usage: {sys.argv[0]} <input_file.anim> [frameRate]", file=sys.stderr)
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.is_file():
        print(f"Error: '{input_path}' not found.", file=sys.stderr)
        sys.exit(1)

    override_rate = int(sys.argv[2]) if len(sys.argv) == 3 else None

    text = input_path.read_text(encoding="utf-8")
    if override_rate is not None:
        text = override_framerate(text, override_rate)
    formatted = inline_keyframes(text)

    output_path = input_path.parent / f"{input_path.name}"
    output_path.write_text(formatted, encoding="utf-8")
    print(f"Wrote: {output_path}")

if __name__ == "__main__":
    main()
