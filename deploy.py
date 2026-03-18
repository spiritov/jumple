from sys import exit
from pathlib import Path
from shutil import copy, copytree

def main():
    with open("jumple/jumple_day_number.txt", "r+") as f:
        day_num = int(f.read().strip()) + 1
        f.seek(0)
        f.write(str(day_num))

    day_image_dir = Path(f"jumple-assets/assets/maps/{day_num}")
    if not day_image_dir.is_dir():
        print(f"No new asset folder at '{day_image_dir}' for day '{day_num}'")
        exit(1)
        return

    day_image_paths = [day_image_dir.joinpath(f"{i+1}.jpg") for i in range(5)]
    for day_image_path in day_image_paths:
        if not day_image_path.is_file():
            print(f"Missing image expected at '{day_image_path}' for day '{day_num}'")
            exit(1)
            return

    target_image_dir = f"jumple/assets/maps/{day_num}/"
    print(f"Copying directory from '{day_image_dir}' to '{target_image_dir}'")
    copytree(day_image_dir, target_image_dir)

if __name__ == "__main__":
    main()
