# Contributing to NEXUS Dashboard

Thank you for considering contributing to NEXUS Dashboard!  
We welcome contributions from the community to make this cyberpunk dashboard even better.

---

## How Can You Contribute?

You can contribute in many ways:
- Reporting Bugs :bug:
- Suggesting New Features :sparkles:
- Improving UI/UX :art:
- Adding New Backend Endpoints (e.g., Disk I/O, Fan Speed)
- Adding New Frontend Components (Charts, Widgets, Themes)
- Fixing Typos & Documentation
- Enhancing Responsiveness
- Performance Improvements

---

## Development Setup

1. **Fork** the repository
2. **Clone** your fork:
```bash
   git clone https://github.com/ItsWanheda/nexus-dashboard.git
   cd nexus-dashboard
```
3. **Install Python Dependencies**:
```bash
   pip install psutil fastapi uvicorn
   or
   pip install -r requirements.txt
```
4. **Open** the project in your favorite code editor **(VS Code recommended)**
5. **Start** the Backend:
```bash
   python server.py
```
6. **Open index.html in your browser (preferably via a local server like VS Code Live Server).**

## Pull Request Guidelines
1. Create a new branch for your feature or fix:
```bash
git checkout -b feature/amazing-feature
# or
git checkout -b bugfix/issue-name
```
2. Make your changes and test thoroughly.
3. Frontend Changes:
* Keep the cyberpunk aesthetic consistent.
* Use CSS custom properties (--var) where possible.
* Ensure mobile responsiveness is maintained.

4. Backend Changes:
* Ensure new endpoints are documented in the server.py docstrings.
* Handle exceptions gracefully (e.g., if psutil fails).
* Maintain CORS security best practices.
5. *Commit your changes with clear messages:*
```bash
git commit -m "feat: add live memory usage widget"
git commit -m "fix: resolve mobile sidebar overlap"
```
6. **Push to your branch and open a Pull Request to the main branch.**

## Code Style
* JavaScript: Use ES6+ features (let/const, arrow functions, async/await).
* Python: Follow PEP 8 guidelines. Use type hints where appropriate.
* CSS: Use BEM-like naming or consistent class naming. Use CSS Variables for theming.

## Reporting Bugs
**Please use the GitHub Issues tab to report bugs. Include:**
* A clear title.
* Steps to reproduce.
* Expected vs. Actual behavior.
* Screenshots if applicable.

## License
***By contributing, you agree that your contributions will be licensed under the MIT License.***