# key-value-service
RESTful API with Node.js, Express and PostgreSQL for key:value service

# postgres
$ sudo su - postgres
$ psql
postgres=# CREATE ROLE kv_app WITH LOGIN PASSWORD '2wsxZAQ!';
postgres=# ALTER ROLE kv_app CREATEDB;

$ psql -U kv_app -W -h localhost -d postgres
postgres=> CREATE DATABASE kv_app_test;
postgres=> CREATE DATABASE kv_app_data;

# docker
sudo docker build -t sa100/kv-app .
sudo docker run -d --restart always -e POSTGRES_DB_BASE=kv_app_data --network=host  sa100/kv-app
