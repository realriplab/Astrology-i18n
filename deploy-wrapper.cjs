/**
 * deploy-wrapper.cjs - 杭州云合智联专用版
 * 功能：执行 EdgeOne 增量部署，并为 Dokploy 提供监控面板
 */
const { exec } = require('child_process');
const http = require('http');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.EDGEONE_API_TOKEN;
const PROJECT = process.env.EDGEONE_PROJECT_NAME;

let deployState = {
    status: 'RUNNING', // RUNNING, SUCCESS, FAILED
    logs: [],
    startTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
};

function log(msg) {
    const entry = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log(entry);
    // 只保留最近 100 行日志，防止内存溢出
    if (deployState.logs.length > 100) deployState.logs.shift();
    deployState.logs.push(entry);
}

function startDeployment() {
    if (!TOKEN || !PROJECT) {
        deployState.status = 'FAILED';
        log("❌ 错误: 环境变量 EDGEONE_API_TOKEN 或 EDGEONE_PROJECT_NAME 未配置");
        return;
    }

    log(`🚀 启动增量同步: 项目 [${PROJECT}]`);

    // 增量部署核心命令：不带 --force。CLI 会自动进行 Hash 比对
    const cmd = `edgeone pages deploy ./dist -n "${PROJECT}" -t "${TOKEN}"`;

    const child = exec(cmd);

    child.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => { if (line.trim()) log(line.trim()); });
    });

    child.stderr.on('data', (data) => {
        log(`[边缘服务提示] ${data.trim()}`);
    });

    child.on('close', (code) => {
        if (code === 0) {
            deployState.status = 'SUCCESS';
            log("✅ 全球边缘节点增量同步完成！");
        } else {
            deployState.status = 'FAILED';
            log(`❌ 同步中断，退出码: ${code}。请检查 Token 是否有效。`);
        }
    });
}

// 建立状态监控 Web 服务器
const server = http.createServer((req, res) => {
    // 1. Dokploy 健康检查路径
    if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
        return;
    }

    // 2. 部署状态看板
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>部署中心 | ${PROJECT}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f1f5f9; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
                .card { background: #1e293b; padding: 2rem; border-radius: 1rem; border: 1px solid #334155; width: 90%; max-width: 650px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .status-tag { padding: 4px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; }
                .RUNNING { background: #1d4ed8; color: #fff; animation: pulse 2s infinite; }
                .SUCCESS { background: #065f46; color: #34d399; }
                .FAILED { background: #7f1d1d; color: #f87171; }
                .log-window { background: #000; color: #10b981; padding: 1.25rem; border-radius: 0.5rem; font-family: "SFMono-Regular", Consolas, monospace; height: 320px; overflow-y: auto; white-space: pre-wrap; font-size: 13px; line-height: 1.5; border: 1px solid #334155; }
                .footer { margin-top: 1.5rem; color: #64748b; font-size: 0.8rem; text-align: center; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h2 style="margin:0;">${PROJECT} 部署详情</h2>
                    <span class="status-tag ${deployState.status}">${deployState.status}</span>
                </div>
                <div style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 1rem;">
                    开始时间: ${deployState.startTime} | 模式: 增量同步 (Incremental)
                </div>
                <div class="log-window">${deployState.logs.join('\n') || '正在初始化实时日志...'}</div>
                <div class="footer">
                    杭州云合智联科技有限公司<br>
                    © 2025 Yunhe Intelligence Technology
                </div>
            </div>
            <script>
                // 每 5 秒刷新一次页面以查看最新日志
                if ("${deployState.status}" === "RUNNING") {
                    setTimeout(() => { window.location.reload(); }, 5000);
                }
            </script>
        </body>
        </html>
    `);
});

server.listen(PORT, () => {
    log(`✅ 监控服务器已启动，监听端口: ${PORT}`);
    startDeployment();
});