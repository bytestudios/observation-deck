# Observation Deck

Observation Deck helps libraries, makerspaces and cultural institutions track moments and see trends in the organization's events and programs, and helps them track and share the experiences in a way to help show the value and to create a system of continuous improvement.

Every event can be chock full of eurkea and a-ha moments, and will also have other indicators of learning, experiencing, taking risks and building relationships. Using a framework to help find and tag the right moments will help an organization share and track these moments, and help build stronger events and programs.

The frameworks are created by librarians and library makerspace staff, and each framework has a series of dimensions and indicators that group moments in a way that ties to standardized goals, but are also infinitely customizable. Organizations are encouraged to create their own frameworks connect the dimensions with the organization's mission or vision, and then indicators of real moments that illustrate that dimension or mission element.

Observation Deck's Observer Tool makes it easy for event facilitators, library staff or volunteers to catch moments, photograph the moment or outcome (like artwork or a lego model), and tag them with appropriate, standardized indicators. Each event, program or makerspace time is saved as a "session" and has any number of "observations" with each observation having a dimension / indicator, optional note and optional image. Each session is then marked at the end with how many participants, age groups and even the room's mood as a series of pre-defined options per organization.

The Observer Tool was designed to be easily managed by the event facilitator or a nearby volunteer or staff person. A facilitator can quickly add observations between tasks during the event, or they can take a series of photos and add and tag them after the event. Sessions can be saved as complete or incomplete, and can be found to modify after the fact, like a parent talking about their child's reaction to the event days later.

Observation Deck's Reporting Tool shares the moments with stakeholders including board members, library or makerspace leadership, partner organizations, and the public via social media. Graphs and data exploring tools then help managers see patterns and ideas that can help to inform decisions and practices to make better events have better programs and indentify training opportunities for staff and volunteers. 

The Reporting Tool makes it easy to pare down all sessions by date, mood, size, age group and partner, and filter observations by framework, dimension and indicator. This helps ask bigger questions through comparison and finite data sets.

Since Observation Deck is based on an open format called GraphQL, any number of metrics can be pulled from the data to populate other dashboards or to build data sets over time. As well, any number of custom observation data points can be added, and entire new tools could be built to add sessions and observations.

## Features

There are three parts to the Observation Deck tool:

### Observer Tool

A mobile or touch screen interface for adding observations during or directly after an event.

### Reporting Tool

A desktop or large tablet inteface to help people dig into and find observations that matter, and to help them understand the data by paring it down by partner, framework, age group, size and more.

### Admin (from Directus, or Directus Cloud)

A data back-end tool where new observer and institutional manager accounts can be managed, and global settings like frameworks, dimensions and indicators, and the mood questions for sessions, etc. 

Directus is also the GraphQL server that will allow API calls to the data, and give organizations the opportunity to pull data into other interfaces and analytics / metrics software.

## Requirements

Observation deck is a Vue application written in Quasar UMD, and works entirely without a build step.

- Directus, we're using v10.x, currently 10.10.7
- NVM to choose the version of Node, which we're using 18
- Nginx for the httpd server, with a proxy to the Directus server (optional, could use Apache)
- MySQL server for the data, with a database called 'directus' and use / password with access to that database (optional) (We have a second user for offsite access to the databse.)
- PM2 to manage the Directus process (optional)
- Certbot for site certificates (optional)
- Snap to install Certbot (optional)
- Ubuntu (optional)

## Installation

Using a fresh Ubuntu 23.10 server:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18
nvm use 18
apt install nginx mysql-server
npm install pm2@latest -g
pm2 startup systemd
service pm2-root status
service pm2-root start
```

### Setting up MySQL
Create the Directus MySQL database / user
```
mysql -u root -p mysql
```
Once inside:
```
CREATE DATABASE `directus` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'directus'@'localhost' IDENTIFIED WITH mysql_native_password BY 'aReallyGr8Passw';
GRANT ALL ON `directus`.* to 'directus'@'localhost';
```

### Setting up Nginx:

```
mkdir /var/www/vhosts/
mkdir /var/www/vhosts/odeck.yoursite.org
mkdir /var/www/vhosts/odeck.yoursite.org/htdocs
mkdir /var/www/vhosts/odeck.yoursite.org/htdocs/home
nano /var/www/vhosts/odeck.yoursite.org/htdocs/home/index.html (add ‘<h1>Hello</h1>’)
mkdir /var/www/vhosts/odeck.yoursite.org/logs
nano /etc/nginx/sites-available/odeck.yoursite.org
```
And inside Nano, add:
```
server {

    root /var/www/vhosts/odeck.yoursite.org/htdocs;
    index index.html index.htm index.nginx-debian.html;

    server_name odeck.yoursite.org;
    access_log /var/www/vhosts/odeck.yoursite.org/logs/access_log;
    error_log /var/www/vhosts/odeck.yoursite.org/logs/error_log;

    location /home {
        try_files $uri $uri/ =404;
    }

    location / {
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Then we need to create a symlink to the place nginx will look for sites:
```
ln -s /etc/nginx/sites-available/madpl.yoursite.org /etc/nginx/sites-enabled/
```
We also need to allow larger uploads, so:
```
nano /etc/nginx/nginx.conf
```
and add under the http section:
```
http {
	## added to support larger upload size
	client_max_body_size 64M;
```

Now restart the service. The Let’s Encrypt’s Certbot below will add other things to this file later. 
```
systemctl restart nginx
```

### Add Directus
Go to the server’s root (not htdocs) and then install and set up Directus with npx:
```
cd /var/www/vhosts/madpl.yoursite.org/
npx create-directus-project directus-project
```
Follow the prompts to use MySQL with default answers except for the username and password, set in the MySQL section above:  
```
directus / aReallyGr8Passw
```

Then go into the new directory just created edit this file:
```
cd directus-project
nano .env
```
And change these line to match:
```
PUBLIC_URL="http://localhost:8055"
LOG_LEVEL="warn"
ROOT_REDIRECT="./home"
SERVE_APP=true
```

Get process manager pm2 to automatically start and keep Directus running. It’s important to be in your directus project directory for setting PM2 up, if you’re not already there:
```
cd /var/www/vhosts/madpl.yoursite.org/directus-project/
```

Then edit package.json:
```
nano package.json
```
…and in the “scripts” section, just above “test”, add:
```
"start": "npx directus start",
…or if there’s upload size issues, try this:
"start": "npx --max-old-space-size=61536 directus start",
```

Then start the project under pm2:
```
pm2 start npm --name "directus" -- start
pm2 save
```
Then test it using pm2 monit, where you should see the process running:
```
pm2 monit
```

### Importing
Now we can import the schema, so from the main Directus directory:
```
npx directus schema apply new-snapshot.yaml
```

## How to deploy quickly for testing (Docker)

Coming soon

## Sponsors

Coming soon
