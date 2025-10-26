let fileStructure = {};
let currentPath = [];

// Load file structure from JSON
async function loadFileStructure() {
    try {
        const response = await fetch('file_structure.json');
        fileStructure = await response.json();
        renderFileList();
    } catch (error) {
        console.error('Error loading file structure:', error);
        document.getElementById('file-list').innerHTML = `
            <tr><td colspan="3">Error loading file structure. Make sure file_structure.json exists.</td></tr>
        `;
    }
}

function getFileClass(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
        return 'file-pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) {
        return 'file-image';
    } else {
        return 'file-html';
    }
    return 'file';
}

function renderFileList() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    
    // Update breadcrumb
    updateBreadcrumb();
    
    // Update title
    const titlePath = currentPath.length > 0 ? 'vault/' + currentPath.join('/') + '/' : 'vault/';
    document.querySelector('h1').textContent = `Index of ${titlePath}`;
    
    if (currentPath.length === 0) {
        // Root level - show folders
        Object.keys(fileStructure).sort().forEach(folder => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" onclick="openFolder('${folder}'); return false;" class="folder">${folder}</a></td>
                <td>-</td>
                <td>-</td>
            `;
            fileList.appendChild(row);
        });
    } else if (currentPath.length === 1) {
        // Inside a folder - show files
        const folder = currentPath[0];
        const files = fileStructure[folder] || [];
        
        files.forEach(fileInfo => {
            const fileClass = getFileClass(fileInfo.name);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" onclick="openFile('${fileInfo.path}'); return false;" class="${fileClass}">${fileInfo.name}</a></td>
                <td>${fileInfo.size}</td>
                <td>${fileInfo.modified}</td>
            `;
            fileList.appendChild(row);
        });
    }
}

function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    if (currentPath.length === 0) {
        breadcrumb.style.display = 'none';
    } else {
        breadcrumb.style.display = 'block';
        breadcrumb.innerHTML = '<a href="#" onclick="goBack(); return false;">[parent directory]</a>';
    }
}

function openFolder(folderName) {
    currentPath.push(folderName);
    renderFileList();
}

function goBack() {
    if (currentPath.length > 0) {
        currentPath.pop();
        renderFileList();
    }
}

function goToRoot() {
    currentPath = [];
    renderFileList();
}

function openFile(filePath) {
    // Navigate to the HTML file in the same window
    window.location.href = filePath;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFileStructure();
});
