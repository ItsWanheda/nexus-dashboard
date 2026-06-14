# NEXUS // CORE DASHBOARD

A futuristic, cyberpunk-style system monitoring dashboard. Unlike typical static dashboards, this project uses a **Python Backend** to provide **real-time** hardware statistics (CPU, RAM, GPU, Network) and system control (Process Management, Terminal).

![Preview](src/img/Preview.png)

## 🚀 Features

- **Real-Time Hardware Monitoring**: Live CPU, RAM, GPU, and Network stats via `psutil`.
- **Process Manager**: View running processes and kill them directly from the UI.
- **Integrated Terminal**: Execute system commands securely via the backend.
- **Responsive Cyberpunk UI**: Fully responsive design for Desktop, Tablet, and Mobile.
- **Hybrid Architecture**: Built with Vanilla JS/Frontend and FastAPI/Python Backend.
- **No Frameworks**: Pure HTML, CSS, and JavaScript for the frontend.

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript (ES6+)
- **Backend**: Python 3, FastAPI, Uvicorn, Psutil
- **Design**: Cyberpunk Aesthetic

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- A modern web browser (Chrome, Edge, Firefox)

### 1. Clone the Repository
```bash
git clone https://github.com/ItsWanheda/nexus-dashboard.git
cd nexus-dashboard
```
### 2. Install Dependencies
```bash
pip install psutil fastapi uvicorn
```
or
```bash
pip install -r requirements.txt
```

### 3. Run the Backend
```bash
python server.py
```
**The server will run at http://127.0.0.1:8000**

### 4. Open the Frontend
*Open index.html in your web browser.*

## 📂 Project Structure
```text
nexus-dashboard/
├── src/
│   ├── static/
│   │   └── app.js          # Frontend Logic
│   └── style/
│       └── styles.css      # Frontend Styles
├── index.html              # Main HTML Entry
├── server.py               # Python Backend API
├── requirements.txt        # Python dependencies
├── README.md
├── LICENSE
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```
## ⚠️ Security Note
*** This dashboard includes a Terminal feature that allows executing system commands. ***
* **Local Use Only: This project is designed for local development and personal monitoring.**
* **Do Not Expose: Do not host this dashboard on a public server without implementing strict authentication and command whitelisting.**

## 🤝 Contributing
* Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📄 License
* This project is licensed under the MIT License - see the LICENSE file for details.

### Made with <3 for cyberpunk aesthetics