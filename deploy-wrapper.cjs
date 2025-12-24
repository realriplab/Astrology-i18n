/**
 * deploy-wrapper.cjs
 * 纯净版：请直接全选覆盖，不要保留任何 字符
 */
const { exec } = require('child_process');
const http = require('http');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.EDGEONE_API_TOKEN;
const PROJECT = process.env.EDGEONE_PROJECT_NAME;
const DIST_DIR = './dist';

let deployState = {
    status: 'PENDING',
    startTime: new Date(),
    logs: [],
    exitCode: null
};

function log(message, type = 'info') {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const entry = `[${timestamp}][${type.toUpperCase()}] ${message}`;
    console.log(entry);
    deployState.logs.push(entry);
}

function runDeployment() {
    if (!TOKEN || !PROJECT) {
        deployState.status = 'FAILED';
        log('CRITICAL ERROR: Missing EDGEONE_API_TOKEN or EDGEONE_PROJECT_NAME env vars.', 'error');
        return;
    }

    deployState.status = 'RUNNING';
    log(`Starting deployment for project: ${PROJECT}`);

    // 执行上传指令
    const command = `edgeone pages deploy ${DIST_DIR} -n "${PROJECT}" -t "${TOKEN}" --force`;

    log('Executing EdgeOne CLI command...');

    const child = exec(command, {
        env: { ...process.env },
        maxBuffer: 1024 * 1024 * 10
    });

    child.stdout.on('data', (data) => {
        data.toString().split('\n').forEach(line => {
            if (line.trim()) log(line.trim(), 'stdout');
        });
    });

    child.stderr.on('data', (data) => {
        data.toString().split('\n').forEach(line => {
            if (line.trim()) log(line.trim(), 'stderr');
        });
    });

    child.on('close', (code) => {
        deployState.exitCode = code;
        if (code === 0) {
            deployState.status = 'SUCCESS';
            log('Deployment completed successfully!');

            const fs = require('fs');
            if (fs.existsSync(DIST_DIR)) {
                log('Cleaning up dist directory to save space...');
                fs.rmSync(DIST_DIR, { recursive: true, force: true });
            }
        } else {
            deployState.status = 'FAILED';
            log(`Deployment failed with exit code ${code}.`, 'error');
        }
    });
}

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Deployment: ${PROJECT}</title>
            <style>
                body { font-family: monospace; background: #121212; color: #e0e0e0; padding: 20px; }
                .status { padding: 8px 15px; border-radius: 4px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
                .SUCCESS { background: #2e7d32; } .FAILED { background: #c62828; } .RUNNING { background: #1565c0; }
                .log-box { background: #000; padding: 15px; border: 1px solid #333; border-radius: 4px; white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <h1>EdgeOne Pages Deployment Dashboard</h1>
            <div class="status ${deployState.status}">STATUS: ${deployState.status}</div>
            <div class="log-box">${deployState.logs.join('\n') || 'Waiting for logs...'}</div>
        </body>
        </html>
    `);
});

server.listen(PORT, () => {
    log(`Monitor server running on port ${PORT}`);
    runDeployment();
});