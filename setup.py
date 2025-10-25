"""
Setup script for the visualisations website.
This script will:
1. Copy all HTML files from the visualisations folder
2. Generate the file structure JSON
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime

def get_file_size(file_path):
    """Get file size in human-readable format"""
    size = os.path.getsize(file_path)
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"

def get_file_modified_date(file_path):
    """Get file modification date"""
    timestamp = os.path.getmtime(file_path)
    return datetime.fromtimestamp(timestamp).strftime('%m/%d/%y, %I:%M:%S %p')

def copy_visualisations(source_path, dest_path):
    """Copy the visualisations folder to the repository"""
    source_path = Path(source_path)
    dest_path = Path(dest_path)
    
    if not source_path.exists():
        print(f"❌ Error: Source path {source_path} does not exist!")
        return False
    
    # Create destination visualisations folder
    dest_vis_folder = dest_path / "visualisations"
    dest_vis_folder.mkdir(exist_ok=True)
    
    print(f"📁 Copying files from {source_path}")
    print(f"   to {dest_vis_folder}\n")
    
    copied_count = 0
    
    # Check if files are directly in the folder or in subfolders
    has_subfolders = any(item.is_dir() for item in source_path.iterdir())
    
    if has_subfolders:
        # Copy from subdirectories
        for folder in source_path.iterdir():
            if folder.is_dir():
                dest_folder = dest_vis_folder / folder.name
                dest_folder.mkdir(exist_ok=True)
                
                for file in folder.iterdir():
                    if file.is_file() and file.suffix.lower() == '.html':
                        shutil.copy2(file, dest_folder / file.name)
                        copied_count += 1
                        print(f"  ✓ {folder.name}/{file.name}")
    else:
        # Copy files directly from the visualisations folder
        for file in source_path.iterdir():
            if file.is_file() and file.suffix.lower() == '.html':
                shutil.copy2(file, dest_vis_folder / file.name)
                copied_count += 1
                print(f"  ✓ {file.name}")
    
    print(f"\n✅ Copied {copied_count} HTML files\n")
    return True

def generate_structure(vis_path):
    """Generate file structure JSON from the local visualisations folder"""
    vis_path = Path(vis_path)
    structure = {}
    
    if not vis_path.exists():
        print(f"❌ Error: Path {vis_path} does not exist!")
        return structure
    
    print(f"📊 Scanning folder structure...\n")
    
    # Check if there are subdirectories or files directly
    subdirs = [item for item in vis_path.iterdir() if item.is_dir()]
    html_files = [item for item in vis_path.iterdir() if item.is_file() and item.suffix.lower() == '.html']
    
    if subdirs:
        # Structure with subdirectories
        for folder in sorted(subdirs):
            folder_name = folder.name
            structure[folder_name] = []
            
            for file in sorted(folder.iterdir()):
                if file.is_file() and file.suffix.lower() == '.html':
                    file_info = {
                        'name': file.name,
                        'size': get_file_size(file),
                        'modified': get_file_modified_date(file),
                        'path': f'visualisations/{folder_name}/{file.name}'
                    }
                    structure[folder_name].append(file_info)
    elif html_files:
        # Files directly in visualisations folder - create a single "root" entry
        structure['all'] = []
        for file in sorted(html_files):
            file_info = {
                'name': file.name,
                'size': get_file_size(file),
                'modified': get_file_modified_date(file),
                'path': f'visualisations/{file.name}'
            }
            structure['all'].append(file_info)
    
    return structure

def main():
    print("=" * 60)
    print("  Visualisations Website Setup")
    print("=" * 60 + "\n")
    
    # Paths
    source_path = r"D:\mod_add\bilinear_modular_addition\visualisations"
    repo_path = Path(__file__).parent
    
    # Step 1: Copy files
    print("STEP 1: Copying HTML files")
    print("-" * 60)
    success = copy_visualisations(source_path, repo_path)
    
    if not success:
        return
    
    # Step 2: Generate structure
    print("STEP 2: Generating file structure")
    print("-" * 60)
    vis_local_path = repo_path / "visualisations"
    structure = generate_structure(vis_local_path)
    
    # Save to JSON
    output_file = repo_path / "file_structure.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, indent=2)
    
    print(f"✅ File structure saved to file_structure.json")
    print(f"   Found {len(structure)} folders:")
    for folder, files in structure.items():
        print(f"     - {folder}: {len(files)} HTML files")
    
    print("\n" + "=" * 60)
    print("✅ Setup complete! You can now open index.html")
    print("=" * 60)

if __name__ == "__main__":
    main()
