# Serverless Computing for IoT

Serverless computing is a cloud-computing execution model in which the cloud provider acts as the server, dynamically managing the allocation of machine resources.  Serverless Computing exploits Function as a service (FaaS) that is a category of cloud computing services that provides a platform allowing customers to develop, run, and manage application functionalities without the complexity of building and maintaining the infrastructure typically associated with developing and launching an app.Building an application following this model is one way of achieving a "serverless" architecture, and is typically used when building microservices applications.

The Internet of things (IoT) is the network of physical devices, vehicles, home appliances, and other items embedded with electronics, software, sensors, actuators, and connectivity which enables these things to connect, collect and exchange data.

We are interest to efficiently collect and elaborate this data, and produce new data as answer to particular condition computed from the data received. Cloud architectures provides an efficient methods to build this kind of applications.

<p align="center"><img src="/assets/iot-architecture.png" width="1000"/></p>

#### Tutorial Structure

* **[Audience](#audience)**
* **[Prerequisites](#prerequisites)**
* **[Installation](#installation)**
* **[Temperature Example](#temperature-example)**


## Audience
This tutorial is designed for building a computing architecture, based on open-source software,  that allows the users to exploit Function-as-service model in the context of IoT. The idea is provides a system which allows as in Amazon Aws or Microsoft Azure, and so on, to deploy functions that are trigged by events generated from small devices such as sensors and  mobile (IoT devices), commonly these devices communicates using message-passing, in particular on dedicated protocols as AMQP or MQTT.  

The end of this tutorial provides example that deploy a function able to log the temperature value received by a sensor on the AMQP protocol, in this example the events are generated by another function executed on the system or outside (this is a semplification, but it is easily to test using a real device that allows to send messages on AMQP protocol).

## Prerequisites
- OS: 
    - Ubuntu 18.04 LTS
- Software:
    - Docker and Docker Compose (Application containers engine)
    - Nuclio (Serverless computing provider)
    - RabbitMQ (AMQP and MQTT message broker)
    - Node.js

## Installation

This tutorial is made on top of one local machine an Linux Ubuntu 18.04 LTS machine. 

### Docker

Docker is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package. By doing so, thanks to the container, the developer can rest assured that the application will run on any other Linux machine regardless of any customized settings that machine might have that could differ from the machine used for writing and testing the code.

In a way, Docker is a bit like a virtual machine. But unlike a virtual machine, rather than creating a whole virtual operating system, Docker allows applications to use the same Linux kernel as the system that they're running on and only requires applications be shipped with things not already running on the host computer. This gives a significant performance boost and reduces the size of the application.

**TIP** Docker is used in the architecture to deploy the function in an application container, each function is a Docker container that is listening on a socket port and can be invoked by an HTTP request, or by other triggers.

Install Docker using the Docker CE installation [guide](https://docs.docker.com/install/linux/docker-ce/ubuntu/#extra-steps-for-aufs).

```sh
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

**IMPORTANT FIX** Ubuntu 18.04 changed to use systemd-resolved to generate /etc/resolv.conf. Now by default it uses a local DNS cache 127.0.0.53. That will not work inside a container, so Docker will default to Google's 8.8.8.8 DNS server, which may break for people behind a firewall. Refers to the [Stackoverflow discussion](https://stackoverflow.com/questions/20430371/my-docker-container-has-no-internet).

```sh
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

----------------------------------------------------------------------------------------------------------------------------
### Docker Compose

Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services.

**TIP** Docker compose is the technology used by Nuclio to easily create, build and deploy Docker application containers (the functions in this case).

Install Docker Compose using the Docker Compose installation [guide](https://docs.docker.com/compose/install/#install-compose).

```sh
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

------------------------------------------------------------------------------------------------------------------------------
### Nuclio 

Nuclio (High-Performance Serverless event and data processing platform) is a new "serverless" project, derived from Iguazio's elastic data life-cycle management service for high-performance events and data processing. The simplest way to explore Nuclio is to run its graphical user interface (GUI) of the Nuclio dashboard. 

**TIP** The Nuclio documentation is available at [this link](https://nuclio.io/docs/latest/).

Start [Nuclio](https://github.com/nuclio/nuclio) using a docker container.

```sh
$ docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64
```

Browse to http://localhost:8070, create a project, and add a function. When run outside of an orchestration platform (for example, Kubernetes or Swarm), the dashboard will simply deploy to the local Docker daemon.

**TIP**  Nuclio provide also the nctcl application client that allows to basically execute the same operation of Nuclio dashboard.

----------------------------------------------------------------------------------------------------------------------------

### RabbitMQ 

RabbitMQ is lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols. RabbitMQ can be deployed in distributed and federated configurations to meet high-scale, high-availability requirements.

Start [RabbitMQ](https://www.rabbitmq.com) instance with MQTT enabled using docker.

```sh
$ sudo docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt 
```

Browse to http://localhost:9000, and login using username: guest and password: guest, to access to the RabbitMQ managment, where is possible to visualize the message queues and the broker status.


------------------------------------------------------------------------------------------------------------------------------

#### Library for AMQP and MQTT clients

There are different libraries for many languages for interacting with protocol AMQP and MQTT you can use what you want. For JavScript we used this [library](https://github.com/squaremo/amqp.node).

-----------------------------------------------------------------------------------------------------------------------------

## Docker TIPS

In this section are presentented several Docker useful commands:
- Docker container ID: ```sudo docker ps -a```, displays all deployed containers, rember that functions are Docker containers, the IMAGE field is the function name and version, while the CONTAINER ID is the ID of the function. In this view is also possible to see the listening port for the function in the field PORTS.
- Docker Logs: ```sudo docker log CONTAINER ID```, displays the STDOUT and STDERR of the associated container.
- Docker Kill: ```sudo docker kill CONTAINER ID```, kills the associated container.
- Docker Remove: ```sudo docker rm CONTAINER ID```, removes the associated container.

-----------------------------------------------------------------------------------------------------------------------------------

**Authors**
ISISLab - Univeristà degli Studi di Salerno
- Vittorio Scarano
- Carmine Spagnuolo
- Matteo D'Auria

