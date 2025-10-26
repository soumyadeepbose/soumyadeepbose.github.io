"""
Setup script for the vault browser website.
This script will:
1. Scan the vault folder in the working directory
2. Generate the file structure JSON for all file types
"""

import os
import json
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
    """Get file modification date in dd/mm/yyyy format"""
    timestamp = os.path.getmtime(file_path)
    return datetime.fromtimestamp(timestamp).strftime('%d/%m/%Y, %I:%M:%S %p')

def generate_structure(vault_path):
    """Generate file structure JSON from the vault folder"""
    vault_path = Path(vault_path)
    structure = {}
    
    if not vault_path.exists():
        print(f"❌ Error: Path {vault_path} does not exist!")
        return structure
    
    print(f"📊 Scanning folder structure...\n")
    
    # Get all subdirectories in the vault folder
    subdirs = [item for item in vault_path.iterdir() if item.is_dir()]
    direct_files = [item for item in vault_path.iterdir() if item.is_file()]
    
    if subdirs:
        # Structure with subdirectories
        for folder in sorted(subdirs):
            folder_name = folder.name
            structure[folder_name] = []
            
            # Get all files in this folder (any type)
            for file in sorted(folder.iterdir()):
                if file.is_file():
                    file_info = {
                        'name': file.name,
                        'size': get_file_size(file),
                        'modified': get_file_modified_date(file),
                        'path': f'vault/{folder_name}/{file.name}'
                    }
                    structure[folder_name].append(file_info)
                    print(f"  ✓ {folder_name}/{file.name}")
    
    if direct_files:
        # Files directly in vault folder
        if 'root' not in structure:
            structure['root'] = []
        for file in sorted(direct_files):
            file_info = {
                'name': file.name,
                'size': get_file_size(file),
                'modified': get_file_modified_date(file),
                'path': f'vault/{file.name}'
            }
            structure['root'].append(file_info)
            print(f"  ✓ {file.name}")
    
    return structure

def main():
    print("=" * 60)
    print("  Vault Browser Setup")
    print("=" * 60 + "\n")
    
    # Paths
    repo_path = Path(__file__).parent
    vault_path = repo_path / "vault"
    
    # Check if vault folder exists
    if not vault_path.exists():
        print(f"❌ Error: 'vault' folder not found in {repo_path}")
        print(f"   Please create a 'vault' folder and add your files there.")
        return
    
    # Generate structure
    print("Scanning vault folder...")
    print("-" * 60)
    structure = generate_structure(vault_path)
    
    if not structure:
        print(f"⚠️  No folders or files found in vault folder")
        return
    
    # Save to JSON
    output_file = repo_path / "file_structure.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, indent=2)
    
    print(f"\n✅ File structure saved to file_structure.json")
    print(f"   Found {len(structure)} folders:")
    total_files = 0
    for folder, files in structure.items():
        print(f"     - {folder}: {len(files)} files")
        total_files += len(files)
    print(f"   Total: {total_files} files")
    
    print("\n" + "=" * 60)
    print("✅ Setup complete! You can now open index.html")
    print("=" * 60)

if __name__ == "__main__":
    main()
