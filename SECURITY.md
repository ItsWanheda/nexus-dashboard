# Security Policy

## Supported Versions

The following versions of NEXUS Dashboard are currently supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.1.0   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of NEXUS Dashboard seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report
1. **Do not** open a public GitHub Issue for security vulnerabilities.
2. Email your findings to: **wanheda.work@gmail.com**
3. Include a detailed description of the vulnerability and steps to reproduce it.

### Response Time
We aim to acknowledge and respond to security reports within **48 hours**.

### What to Expect
- We will confirm receipt of your report.
- We will investigate the issue and determine the impact.
- We will release a patch if the vulnerability is valid.
- We will credit you in the changelog (unless you prefer anonymity).

## Known Security Considerations

### Terminal Access
The `Terminal` feature allows execution of system commands via the Python backend.
- **Risk**: Improper input sanitization could lead to Command Injection.
- **Mitigation**: The backend uses `subprocess.run` with `shell=True`. Users should only run this dashboard on trusted local machines.
- **Recommendation**: In production environments, implement a whitelist of allowed commands or disable the terminal endpoint entirely.

### CORS Policy
The backend enables CORS (`allow_origins=["*"]`) for development convenience.
- **Risk**: This allows any website to make requests to your local API.
- **Mitigation**: For production, restrict `allow_origins` to your specific domain or IP.