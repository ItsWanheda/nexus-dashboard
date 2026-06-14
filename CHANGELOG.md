# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.0] - 2026-06-14
### Added
- **Real Hardware Monitoring**: Integrated Python backend (`server.py`) using `psutil` for real-time CPU, RAM, GPU, and Network stats.
- **Process Manager**: New "Processes" tab to view and kill running tasks via the dashboard.
- **Terminal Integration**: New "Terminal" tab allowing safe execution of system commands via the Python backend.
- **Backend API**: FastAPI server with CORS support for frontend communication.
### Fixed
- Fixed CPU monitoring accuracy (previously used random simulation, now uses real OS metrics).
- Fixed mobile menu overlay z-index issues.
### Changed
- **Refactored**: `app.js` to use ES6 classes for better maintainability.
- **Architecture**: Shifted from pure frontend mock data to a hybrid Frontend/Backend architecture.
- **Dashboard UI**: Updated summary cards to display real-time data from the backend.
- **Responsiveness**: Improved mobile sidebar toggle and grid layout for smaller screens.

## [1.0.0] - 2026-06-13
### Added
- Initial release of NEXUS Dashboard.
- Cyberpunk-themed UI with CSS Grid.
- Mock data for Dashboard, Analytics, System, Security, and Logs tabs.
- Responsive design for Mobile and Tablet.
- **WebGPU Support**: Added experimental WebGPU initialization for future GPU load testing.
- **Light Mode**: Added CSS variables for light theme support.