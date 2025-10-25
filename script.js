// Configuration
const GITHUB_USERNAME = 'soumyadeepbose';
const GITHUB_API_BASE = 'https://api.github.com';

// Language colors (common programming languages)
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'TypeScript': '#2b7489',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Shell': '#89e051',
    'Dart': '#00B4AB',
    'R': '#198CE7',
    'Scala': '#c22d40',
    'Perl': '#0298c3'
};

// State
let allRepos = [];
let languageStats = {};

// Initialize the application
async function init() {
    try {
        await loadProfile();
        await loadRepositories();
        displayStatistics();
        displayLanguageChart();
        displayRepositories();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load GitHub data. Please check the username and try again.');
    }
}

// Load user profile
async function loadProfile() {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const profile = await response.json();
        displayProfile(profile);
    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('profile-info').innerHTML = 
            '<div class="error-message">Unable to load profile information</div>';
    }
}

// Display profile information
function displayProfile(profile) {
    const profileSection = document.getElementById('profile-info');
    profileSection.innerHTML = `
        <img src="${profile.avatar_url}" alt="${profile.name || profile.login}" class="profile-avatar">
        <div class="profile-details">
            <h3>${profile.name || profile.login}</h3>
            ${profile.bio ? `<p class="profile-bio">${profile.bio}</p>` : ''}
            <div class="profile-stats">
                <div class="profile-stat"><strong>${profile.followers}</strong> Followers</div>
                <div class="profile-stat"><strong>${profile.following}</strong> Following</div>
                <div class="profile-stat"><strong>${profile.public_repos}</strong> Repositories</div>
            </div>
            <a href="${profile.html_url}" target="_blank" rel="noopener noreferrer" class="profile-link">
                View GitHub Profile →
            </a>
        </div>
    `;
}

// Load all repositories
async function loadRepositories() {
    try {
        let page = 1;
        let hasMore = true;
        allRepos = [];

        while (hasMore) {
            const response = await fetch(
                `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`
            );
            
            if (!response.ok) throw new Error('Failed to fetch repositories');
            
            const repos = await response.json();
            if (repos.length === 0) {
                hasMore = false;
            } else {
                allRepos = allRepos.concat(repos);
                page++;
            }
        }

        // Calculate language statistics
        calculateLanguageStats();
    } catch (error) {
        console.error('Error loading repositories:', error);
        throw error;
    }
}

// Calculate language statistics
function calculateLanguageStats() {
    languageStats = {};
    
    allRepos.forEach(repo => {
        if (repo.language) {
            languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
    });
}

// Display overall statistics
function displayStatistics() {
    const totalRepos = allRepos.length;
    const totalStars = allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = allRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalLanguages = Object.keys(languageStats).length;

    document.getElementById('total-repos').textContent = totalRepos;
    document.getElementById('total-stars').textContent = totalStars;
    document.getElementById('total-forks').textContent = totalForks;
    document.getElementById('total-languages').textContent = totalLanguages;
}

// Display language chart
function displayLanguageChart() {
    const chartContainer = document.getElementById('languages-chart');
    
    if (Object.keys(languageStats).length === 0) {
        chartContainer.innerHTML = '<p class="chart-loading">No language data available</p>';
        return;
    }

    // Sort languages by count
    const sortedLanguages = Object.entries(languageStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 languages

    const total = sortedLanguages.reduce((sum, [, count]) => sum + count, 0);

    const chartHTML = sortedLanguages.map(([language, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        const color = LANGUAGE_COLORS[language] || '#8b949e';
        
        return `
            <div class="language-bar">
                <div class="language-header">
                    <span class="language-name">
                        <span class="language-dot" style="background-color: ${color}"></span>
                        ${language}
                    </span>
                    <span class="language-percentage">${percentage}% (${count} repos)</span>
                </div>
                <div class="language-progress">
                    <div class="language-progress-fill" style="width: ${percentage}%; background: ${color}"></div>
                </div>
            </div>
        `;
    }).join('');

    chartContainer.innerHTML = chartHTML;
}

// Display repositories
function displayRepositories() {
    const reposContainer = document.getElementById('repos-container');
    
    if (allRepos.length === 0) {
        reposContainer.innerHTML = '<p class="loading">No repositories found</p>';
        return;
    }

    // Sort repos by stars, then by update date
    const sortedRepos = [...allRepos].sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
            return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    const reposHTML = sortedRepos.map(repo => createRepoCard(repo)).join('');
    reposContainer.innerHTML = reposHTML;
}

// Create a repository card
function createRepoCard(repo) {
    const languageColor = LANGUAGE_COLORS[repo.language] || '#8b949e';
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <div class="repo-card">
            <div class="repo-header">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                    ${repo.name}
                </a>
            </div>
            ${repo.description ? `<p class="repo-description">${escapeHtml(repo.description)}</p>` : '<p class="repo-description" style="color: #6e7681; font-style: italic;">No description available</p>'}
            <div class="repo-meta">
                ${repo.language ? `
                    <div class="repo-meta-item">
                        <span class="language-dot" style="background-color: ${languageColor}"></span>
                        <span>${repo.language}</span>
                    </div>
                ` : ''}
                <div class="repo-meta-item">
                    ⭐ ${repo.stargazers_count}
                </div>
                <div class="repo-meta-item">
                    🍴 ${repo.forks_count}
                </div>
                ${repo.open_issues_count > 0 ? `
                    <div class="repo-meta-item">
                        📋 ${repo.open_issues_count} issues
                    </div>
                ` : ''}
                <div class="repo-meta-item">
                    Updated ${updatedDate}
                </div>
            </div>
        </div>
    `;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    const reposContainer = document.getElementById('repos-container');
    reposContainer.innerHTML = `<div class="error-message">${message}</div>`;
    
    const profileSection = document.getElementById('profile-info');
    profileSection.innerHTML = `<div class="error-message">${message}</div>`;
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
