module.exports = {
  apps: [
    {
      name: 'meomun-backend',
      cwd: __dirname,
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
