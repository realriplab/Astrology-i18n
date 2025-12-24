/**
 * deploy-wrapper.cjs
 * 状态监控版：上传逻辑已移至构建阶段。
 * 此脚本仅用于保持容器运行、通过 Dokploy 健康检查并展示部署状态。
 */
const http = require('http');

const PORT = process.env.PORT || 3000;
const PROJECT = process.env.EDGEONE_PROJECT_NAME || 'Unknown Project';

// 部署状态（因为能运行到这里，说明构建阶段的上传必然已成功）
let deployState = {
    status: 'SUCCESS',
    completeTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    message: 'Deployment to Tencent Cloud EdgeOne was completed during the Build Phase.'
};

function log(message) {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    console.log(`[${timestamp}][INFO] ${message}`);
}

const server = http.createServer((req, res) => {
    // 1. Dokploy 健康检查接口
    if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
        return;
    }

    // 2. 状态看板页面
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Status: ${PROJECT}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: -apple-system, system-ui, sans-serif; background: #0a0a0a; color: #e0e0e0; padding: 40px; line-height: 1.6; }
                .card { max-width: 600px; margin: 0 auto; background: #161616; border: 1px solid #333; border-radius: 12px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .status-badge { padding: 6px 12px; border-radius: 6px; font-weight: bold; background: #2e7d32; color: #fff; display: inline-block; margin-bottom: 20px; }
                h1 { margin: 0 0 10px 0; font-size: 24px; color: #fff; }
                .meta { color: #888; font-size: 14px; margin-bottom: 20px; }
                .log-box { background: #000; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #4caf50; border-left: 4px solid #2e7d32; }
                hr { border: 0; border-top: 1px solid #333; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="status-badge">ONLINE</div>
                <h1>${PROJECT}</h1>
                <div class="meta">EdgeOne Pages Deployment Status</div>
                <hr>
                <p><strong>Status:</strong> ${deployState.status}</p>
                <p><strong>Last Sync:</strong> ${deployState.completeTime}</p>
                <div class="log-box">
                    &gt; ${deployState.message}<br>
                    &gt; Assets are hosted on EdgeOne Edge Nodes.<br>
                    &gt; Dokploy container is healthy.
                </div>
            </div>
        </body>
        </html>
    `);
});

server.listen(PORT, () => {
    log(`Monitor server running on port ${PORT}`);
    log(`Project: ${PROJECT}`);
    log(`Status: Deployment confirmed via Nixpacks Build Phase.`);
});