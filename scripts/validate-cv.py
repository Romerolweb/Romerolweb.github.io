#!/usr/bin/env python3
"""Validate cv.json against the vendored JSON Resume v1.0.0 schema. No dependencies.

Usage: python3 scripts/validate-cv.py [path/to/cv.json]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TYPES = {"string": str, "number": (int, float), "integer": int, "object": dict, "array": list, "boolean": bool, "null": type(None)}


def resolve(ref, root):
    node = root
    for part in ref.lstrip("#/").split("/"):
        node = node[part]
    return node


def validate(value, schema, root, path, errors):
    if "$ref" in schema:
        schema = resolve(schema["$ref"], root)
    expected = schema.get("type")
    if expected and not isinstance(value, TYPES[expected]) or (expected == "integer" and isinstance(value, bool)):
        errors.append(f"{path}: expected {expected}, got {type(value).__name__}")
        return
    if isinstance(value, str):
        if "pattern" in schema and not re.search(schema["pattern"], value):
            errors.append(f"{path}: {value!r} does not match {schema['pattern']}")
        fmt = schema.get("format")
        if fmt == "email" and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            errors.append(f"{path}: {value!r} is not an email address")
        if fmt == "uri" and not re.match(r"^[a-z][a-z0-9+.-]*:", value, re.I):
            errors.append(f"{path}: {value!r} is not a URI")
    if isinstance(value, dict):
        props = schema.get("properties", {})
        for key in schema.get("required", []):
            if key not in value:
                errors.append(f"{path}: missing required property {key!r}")
        for key, item in value.items():
            if key in props:
                validate(item, props[key], root, f"{path}.{key}", errors)
            elif schema.get("additionalProperties") is False:
                errors.append(f"{path}: property {key!r} is not allowed here")
    if isinstance(value, list) and "items" in schema:
        for index, item in enumerate(value):
            validate(item, schema["items"], root, f"{path}[{index}]", errors)


def main():
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "cv.json"
    schema = json.loads((ROOT / "schema" / "resume.schema.json").read_text())
    data = json.loads(target.read_text())
    errors = []
    validate(data, schema, schema, "resume", errors)
    for job in data.get("work", []):
        for role, items in job.get("categorized_highlights", {}).items():
            if not isinstance(items, list) or not all(isinstance(i, str) for i in items):
                errors.append(f"work[{job.get('name')}].categorized_highlights.{role}: must be a list of strings")
    if errors:
        print(f"{target.name}: {len(errors)} problem(s)")
        print("\n".join(f"  - {e}" for e in errors))
        sys.exit(1)
    print(f"{target.name}: valid JSON Resume v1.0.0 ({len(data.get('work', []))} work entries)")


if __name__ == "__main__":
    main()
