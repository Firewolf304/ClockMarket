# DNASS fork

## Installation:
```
cd ~
git clone https://github.com/Firewolf304/ClockMarket.git
```
* Fedora/Centos/RHEL:
```shell
dnf install nginx postgresql-server postgresql-contrib
postgresql-setup --initdb --unit postgresql
```
Guide: https://docs.fedoraproject.org/en-US/quick-docs/postgresql/

* Debian like:
```shell
apt update
apt install curl ca-certificates nginx postgresql-common postgresql
```
Guide: https://www.postgresql.org/download/linux/debian/

## Run postgresql

* systemd:
```shell
systemctl start postgresql
```
* docker 
```shell
service postgresql start
```

## Init db
```shell
echo "postgres:postgres" | sudo chpasswd
su postgres -c "psql" #enter postgres
```
```sql
CREATE USER admin WITH LOGIN PASSWORD 'securepassword'
CREATE DATABASE webapi;
\c webapi
GRANT CONNECT ON DATABASE webapi TO admin;
GRANT pg_read_all_data TO admin; -- for 14 or later
GRANT pg_write_all_data TO admin; -- for 14 or later
GRANT USAGE ON SCHEMA public TO admin;
GRANT ALL ON SCHEMA public TO admin;
\q
```
If access is denied just reconfigure /var/lib/pgsql/data/pg_hba.conf like (this is not secure):
```text
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     ident
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 ident
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            ident
host    replication     all             ::1/128                 ident
```

## Init nginx

* nginx config:
``` shell
cp -r ./webapi /var/www/webapi
chmod -R 777 /var/www/webapi
echo 'server {
    listen 83;
    server_name 127.0.0.1;

    # Frontend files
    root /var/www/webapi;
    index index.html;
    location / {
        try_files $uri $uri/ @aspnet;
    }

    # aspnet app
    location @aspnet {
        proxy_pass http://127.0.0.1:7007;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location ~* \.(css|js|html|png|jpg|jpeg|gif|ico|svg)$ {
        try_files $uri @aspnet;
    }
}' | tee /etc/nginx/conf.d/webapi.conf
nginx -t
systemctl start nginx
```

## Run project
Just run by debug/release mode or use dotnet for run this project ``` dotnet run --configuration Debug -- ```