const WebSocket = require('ws');
const pty = require('node-pty');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  const shell = pty.spawn('bash', [], {
    name: 'xterm-color',
    cwd: process.env.HOME,
    env: process.env,
  });

  shell.on('data', data => {
    ws.send(data);
  });

  ws.on('message', message => {
    shell.write(message);
  });

  ws.on('close', () => {
    shell.kill();
  });
});

console.log('WebSocket server started on port 8080');