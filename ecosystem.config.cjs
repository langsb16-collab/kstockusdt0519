module.exports = {
  apps: [{
    name: 'webapp',
    script: 'npx',
    args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000 --compatibility-date=2026-04-17',
    cwd: '/home/user/webapp',
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
