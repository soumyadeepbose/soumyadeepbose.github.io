# soumyadeepbose.github.io

Personal portfolio website showcasing GitHub repositories and visualizations.

## Features

- 📊 **Repository Statistics**: View total repositories, stars, forks, and languages used
- 🎨 **Language Visualization**: Interactive chart showing top programming languages
- 📦 **Repository Cards**: Display all public repositories with descriptions, stats, and links
- 🌙 **Dark Theme**: Modern, eye-friendly dark theme design
- 📱 **Responsive**: Fully responsive design that works on all devices
- ⚡ **Fast**: Static website with no backend required

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Fetch API for GitHub data
- **GitHub Pages**: Hosting platform

## How It Works

The website uses the GitHub API to fetch and display:
- User profile information
- Repository statistics
- Language usage breakdown
- Individual repository details

All data is fetched client-side, making the website fast and easy to deploy.

## Deployment

This site is designed to be deployed with GitHub Pages. Simply push to the main branch and enable GitHub Pages in your repository settings.

## Local Development

To run locally:

```bash
# Start a simple HTTP server
python3 -m http.server 8000

# Open http://localhost:8000 in your browser
```

## Customization

To customize for your own GitHub account, edit the `GITHUB_USERNAME` variable in `script.js`:

```javascript
const GITHUB_USERNAME = 'your-username-here';
```

## License

MIT License - feel free to use this template for your own portfolio!
