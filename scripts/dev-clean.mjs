import { spawnSync } from 'node:child_process';
import process from 'node:process';

const ports = [4000, 5173];
if (process.platform === 'win32') {
  const script = ports.map((port) => `Get-NetTCPConnection -State Listen -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { if ($_ -gt 4) { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue; Write-Output "Stopped listener on port ${port} (PID $_)" } }`).join('; ');
  const result = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
} else {
  for (const port of ports) {
    const found = spawnSync('sh', ['-lc', `lsof -tiTCP:${port} -sTCP:LISTEN`], { encoding: 'utf8' });
    const pids = (found.stdout ?? '').trim().split(/\s+/).filter((pid) => /^\d+$/.test(pid));
    for (const pid of pids) {
      try { process.kill(Number(pid), 'SIGTERM'); console.log(`Stopped listener on port ${port} (PID ${pid})`); } catch { /* Process exited between lookup and signal. */ }
    }
  }
}
