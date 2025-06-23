const os = require('os');

const interfaces = os.networkInterfaces();

for (const name of Object.keys(interfaces)) {
  for (const net of interfaces[name]) {
    const { address, family, internal } = net;
    if (family === 'IPv4' && !internal) {
      console.log(`Your local IP is: ${address}`);
    }
  }
}
