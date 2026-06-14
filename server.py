# server.py
import psutil
import subprocess
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sys

# Try to import wmi as fallback if psutil is missing
try:
    import wmi
    USE_WMI = True
except ImportError:
    USE_WMI = False

try:
    import psutil
    USE_PSUTIL = True
except ImportError:
    USE_PSUTIL = False

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats")
async def get_stats():
    try:
        # 1. CPU
        if USE_PSUTIL:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            cpu_count = psutil.cpu_count()
        elif USE_WMI:
            c = wmi.WMI()
            cpu = c.Win32_Processor()[0]
            cpu_percent = cpu.LoadPercentage
            cpu_count = cpu.NumberOfCores
        else:
            cpu_percent = 0
            cpu_count = 0

        # 2. RAM
        if USE_PSUTIL:
            memory = psutil.virtual_memory()
            ram_used_gb = memory.used / (1024**3)
            ram_total_gb = memory.total / (1024**3)
            ram_percent = memory.percent
        elif USE_WMI:
            c = wmi.WMI()
            os = c.Win32_OperatingSystem()[0]
            ram_used_gb = (float(os.TotalVisibleMemorySize) - float(os.FreePhysicalMemory)) / (1024**2)
            ram_total_gb = float(os.TotalVisibleMemorySize) / (1024**2)
            ram_percent = (ram_used_gb / ram_total_gb) * 100
        else:
            ram_used_gb = 0
            ram_total_gb = 0
            ram_percent = 0

        # 3. Network
        if USE_PSUTIL:
            net_io = psutil.net_io_counters()
            bytes_sent = net_io.bytes_sent
            bytes_recv = net_io.bytes_recv
        else:
            bytes_sent = 0
            bytes_recv = 0

        # 4. Disk
        if USE_PSUTIL:
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
        elif USE_WMI:
            c = wmi.WMI()
            disk = c.Win32_LogicalDisk(DeviceID="C:")[0]
            disk_percent = (1 - (float(disk.FreeSpace) / float(disk.Size))) * 100
        else:
            disk_percent = 0

        # 5. GPU (Optional: Requires pynvml for NVIDIA)
        gpu_used = 0.0
        gpu_total = 0.0
        gpu_status = "N/A"
        try:
            from pynvml import nvmlInit, nvmlDeviceGetHandleByIndex, nvmlDeviceGetMemoryInfo
            nvmlInit()
            handle = nvmlDeviceGetHandleByIndex(0)
            info = nvmlDeviceGetMemoryInfo(handle)
            gpu_used = info.used / (1024**3)
            gpu_total = info.total / (1024**3)
            gpu_status = "Active"
        except Exception:
            pass

        return {
            "cpu": {"percent": cpu_percent, "cores": cpu_count},
            "ram": {"used_gb": round(ram_used_gb, 2), "total_gb": round(ram_total_gb, 2), "percent": round(ram_percent, 2)},
            "network": {"sent_mb": round(bytes_sent / (1024**2), 2), "recv_mb": round(bytes_recv / (1024**2), 2)},
            "disk": {"percent": round(disk_percent, 2)},
            "gpu": {"used_gb": round(gpu_used, 2), "total_gb": round(gpu_total, 2), "status": gpu_status}
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/processes")
async def get_processes():
    if not USE_PSUTIL:
        return {"error": "psutil not installed. Install via: pip install psutil"}
    
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status']):
        try:
            pinfo = proc.info
            processes.append({
                "pid": pinfo['pid'],
                "name": pinfo['name'],
                "cpu": round(pinfo['cpu_percent'] or 0, 1),
                "ram_mb": round((pinfo['memory_info'].rss / 1024 / 1024), 2),
                "status": pinfo['status']
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    return sorted(processes, key=lambda x: x['cpu'], reverse=True)[:50]

@app.post("/api/process/kill")
async def kill_process(pid: int):
    if not USE_PSUTIL:
        return {"error": "psutil not installed"}
    try:
        p = psutil.Process(pid)
        p.terminate()
        return {"status": "success", "message": f"Process {pid} terminated"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/terminal")
async def run_terminal_command(command: str):
    """
    WARNING: This executes system commands. 
    Only use in trusted/local environments.
    """
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=10)
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Command timed out", "returncode": -1}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "returncode": -1}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)