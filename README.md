# garage-door-remote
This simple ExpressJS project implements a garage door controller interface that is meant to run on a Rasberry Pi. Three digial GPIO pins are used to check the state of the garage door (e.g. with simple magnetic contacts) and drive a photomos relay to trigger the garage door motor.

## Startup
This project is automatically set up in a production and staging environment by the garagepi playbook. This playbook will aso set up process files for PM2. Add both environments to the PM2 by executing the following with *node_ops*:
```
cd /opt/production
pm2 start
cd /opt/staging
pm2 start
pm2 save
```

## Adding users
Users are stored in *~node_ops/.gdr/users* and can be added or updated by executing:
```
cd /opt/production
node adduser.js
```

## Cleaning the session store
Sessions details are persisted in a filesystem session store located at *~node_ops/.gdr/sessions*. Session expire only after 90 days by default. The purge-sessions.js job will remove all unauthenticated sessions older than 30 minutes. Schedule (four times a day for now) this job by executing:
```
cd /opt/production
pm2 start purge-sessions.js --cron '0 0,6,12,18 * * *'
pm2 save
```
