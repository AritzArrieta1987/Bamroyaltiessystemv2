#!/bin/bash
ssh root@94.143.141.241 'cd /var/www/bamroyalties && git pull origin main && npm run build && cd backend && pm2 restart bamroyalties && sudo systemctl restart nginx && echo "✅ LISTO! https://app.bigartist.es"'
