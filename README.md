## WANGUARD, MYSQL AND GRAFANA INTEGRATION SCRIPT

### Usage

1. Clone this repository.

2. Run on repository folder: ```npm install```

3. Create file: ```.env```

4. Add on .env:

- WANGUARD_API_URL="wanguard_api_url"
- WANGUARD_API_KEY="wanguard_api_key"
- MYSQL_HOST="mysql_address"
- MYSQL_USER="mysql_user"
- MYSQL_PASS="mysql_user_password"
- MYSQL_DB="mysql_database"

5. Add on crontab: 

```* * * * * sleep 30; /usr/bin/node /home/YOUR_USER/Dev/wanguard-grafana/index.js >> /var/log/wanguard-grafana.log 2>&1```