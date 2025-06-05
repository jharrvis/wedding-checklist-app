# Contributing to Wedding Checklist App

Terima kasih atas minat Anda untuk berkontribusi pada Wedding Checklist App! 🎉

## 📋 Daftar Isi

- [Code of Conduct](#code-of-conduct)
- [Cara Berkontribusi](#cara-berkontribusi)
- [Development Setup](#development-setup)
- [Panduan Coding](#panduan-coding)
- [Panduan Commit](#panduan-commit)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

Proyek ini mengikuti [Contributor Covenant](https://www.contributor-covenant.org/). Dengan berpartisipasi, Anda diharapkan untuk menjunjung tinggi kode etik ini.

### Perilaku yang Diharapkan

- Gunakan bahasa yang ramah dan inklusif
- Hormati perbedaan pandangan dan pengalaman
- Berikan dan terima kritik konstruktif dengan baik
- Fokus pada apa yang terbaik untuk komunitas

## 🚀 Cara Berkontribusi

### 1. Types of Contributions

- 🐛 **Bug fixes**
- ✨ **New features**
- 📝 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- 🔧 **Code refactoring**
- 🌐 **Translations**
- 🧪 **Tests**

### 2. Before You Start

- Check existing [issues](https://github.com/username/wedding-checklist-app/issues)
- Look at the [project roadmap](README.md#development-roadmap)
- Join our [Discord community](https://discord.gg/wedding-checklist) for discussions

## 🛠️ Development Setup

### Prerequisites

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Modern web browser
- Git

### Local Setup

1. **Fork the repository**

   ```bash
   # Click 'Fork' button on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/wedding-checklist-app.git
   cd wedding-checklist-app
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start development server**

   ```bash
   npm run dev
   # atau
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Development Tools

```bash
# Linting
npm run lint

# Format code
npm run format

# Validate HTML
npm run validate

# Run all checks
npm run lint && npm run validate
```

## 📝 Panduan Coding

### Code Style

- **JavaScript**: ES6+ features, prefer `const`/`let` over `var`
- **CSS**: BEM methodology untuk class naming
- **HTML**: Semantic HTML5 elements
- **Comments**: JSDoc untuk functions, inline comments untuk complex logic

### File Organization

```
wedding-checklist/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   ├── data.js         # Data and configurations
│   │   └── utils.js        # Utility functions (if needed)
│   └── images/
│       └── *.ico, *.png    # Images and icons
```

### JavaScript Guidelines

```javascript
// ✅ Good
const categories = getCategories();
const isCompleted = task.completed;

/**
 * Renders category list with tasks
 * @param {Array} categories - Array of category objects
 * @returns {string} HTML string
 */
function renderCategories(categories) {
  // Implementation
}

// ❌ Avoid
var cats = getCats();
var done = task.c;

function render(c) {
  // No documentation
}
```

### CSS Guidelines

```css
/* ✅ Good - BEM methodology */
.task-item {
}
.task-item__title {
}
.task-item__title--urgent {
}
.task-item--completed {
}

/* ❌ Avoid */
.task {
}
.taskTitle {
}
.urgent-task-title {
}
```

### HTML Guidelines

```html
<!-- ✅ Good - Semantic HTML -->
<section class="categories">
  <article class="category">
    <header class="category__header">
      <h2 class="category__title">Dekorasi</h2>
    </header>
    <ul class="task-list">
      <li class="task-item">
        <input type="checkbox" id="task-1" class="task__checkbox" />
        <label for="task-1" class="task__label">Pilih tema</label>
      </li>
    </ul>
  </article>
</section>

<!-- ❌ Avoid -->
<div class="cats">
  <div class="cat">
    <div class="title">Dekorasi</div>
    <div class="tasks">
      <div><input type="checkbox" />Pilih tema</div>
    </div>
  </div>
</div>
```

## 📦 Panduan Commit

Gunakan [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(tasks): add priority levels with color coding"

# Bug fix
git commit -m "fix(modal): prevent modal close on form submission"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style
git commit -m "style(css): improve responsive design for mobile"

# Multiple lines
git commit -m "feat(notes): add general notes functionality

- Add notes modal with tabs
- Implement CRUD operations for notes
- Link task notes with general notes system

Closes #123"
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**

   ```bash
   git remote add upstream https://github.com/original/wedding-checklist-app.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   # atau
   git checkout -b fix/bug-description
   ```

3. **Make your changes**

   - Follow coding guidelines
   - Add tests if applicable
   - Update documentation

4. **Test your changes**

   ```bash
   npm run lint
   npm run validate
   # Test manually in browser
   ```

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?

- [ ] Manual testing in Chrome
- [ ] Manual testing in Firefox
- [ ] Manual testing on mobile
- [ ] Automated tests pass

## Screenshots (if applicable)

Add screenshots to help reviewers understand the changes.

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. **Automated checks** must pass
2. **At least one maintainer** review required
3. **All discussions** must be resolved
4. **Merge strategy**: Squash and merge

## 🐛 Bug Reports

Gunakan [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md):

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**

- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## ✨ Feature Requests

Gunakan [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md):

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## 🏷️ Labeling

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority

### Pull Request Labels

- `ready for review` - Ready for code review
- `work in progress` - Still being worked on
- `needs changes` - Changes requested by reviewer
- `approved` - Approved by maintainer

## 🎖️ Recognition

Contributors will be recognized in:

- `README.md` contributors section
- Release notes for significant contributions
- Hall of Fame for major contributors

## 📞 Getting Help

- 💬 **Discord**: [Wedding Checklist Community](https://discord.gg/wedding-checklist)
- 📧 **Email**: dev@weddingchecklist.com
- 📝 **Issues**: [GitHub Issues](https://github.com/username/wedding-checklist-app/issues)
- 📱 **Telegram**: @WeddingChecklistDev

## 📚 Resources

- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [CSS Guidelines](https://cssguidelin.es/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

Terima kasih telah berkontribusi! 🙏

_Happy coding and happy wedding planning! 💍_
