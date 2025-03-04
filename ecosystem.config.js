module.exports = {
  apps: [
    {
      name: 'frontend-roorkee',
      script: 'npm',
      args: 'run start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 80,
      },
}]
}