# Serverless Computing for IoT

## Prerequisites
- Ubuntu 18.04 LTS
- Docker 
- Docker Compose
- Nuclio
- RabbitMQ (MQTT plugin Enabled)

## Software Installation on Ubuntu 

### Docker

Install Docker using the Docker CE installation !(https://docs.docker.com/install/linux/docker-ce/ubuntu/#extra-steps-for-aufs)[guide].

```
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce
```

### Docker Compose
Install Docker Compose using the Docker Compose installation !(https://docs.docker.com/compose/install/#install-compose)[guide].

```
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```
