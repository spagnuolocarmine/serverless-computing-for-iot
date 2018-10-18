# Serverless Computing for IoT

Serverless computing is a cloud-computing execution model in which the cloud provider acts as the server, dynamically managing the allocation of machine resources.  Serverless Computing exploits Function as a service (FaaS) that is a category of cloud computing services that provides a platform allowing customers to develop, run, and manage application functionalities without the complexity of building and maintaining the infrastructure typically associated with developing and launching an app.Building an application following this model is one way of achieving a "serverless" architecture, and is typically used when building microservices applications.

The Internet of things (IoT) is the network of physical devices, vehicles, home appliances, and other items embedded with electronics, software, sensors, actuators, and connectivity which enables these things to connect, collect and exchange data.

We are interest to efficiently collect and elaborate this data, and produce new data as answer to particular condition computed from the data received. Cloud architectures provides an efficient methods to build this kind of applications.

#### Tutorial Structure

* **[Audience](#audience)**
* **[Prerequisites](#prerequisites)**
* **[Installation](#installation)**
* **[Temperature Example](#temperature-example)**


## Audience
This tutorial is designed for building a computing architecture, based on open-source software,  that allows the users to exploit Function-as-service model in the context of IoT. The idea is provides a system which allows as in Amazon Aws or Microsoft Azure, and so on, to deploy functions that are trigged by events generated from small devices such as sensors and  mobile (IoT devices), commonly these devices communicates using message-passing, in particular on dedicated protocols as AMQP or MQTT.  

The end of this tutorial provides example that deploy a function to log the temperature value received by a sensor on the AMQP protocol, in this example the events are generated by another function executed on the system or outside (this is a semplification, but it is easily to test using a real device that allows to send messages on AMQP protocol).

## Prerequisites
- OS: 
    - Ubuntu 18.04 LTS
- Software:
    - Docker and Docker Compose (Application containers engine)
    - Nuclio (Serverless computing provider)
    - RabbitMQ (AMQP and MQTT message broker)
    - Node.js

## Installation

This tutorial is made on top of an Linux Ubuntu 18.04 LTS machine. 

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
$ sudo docker run -p 9000:15672  -p 1818:1818 -p 5672:5672  cyrilix/rabbitmq-mqtt 
```

Browse to http://localhost:9000, and login using username: guest and password: guest, to access to the RabbitMQ managment, where is possible to visualize the message queues and the broker status.


------------------------------------------------------------------------------------------------------------------------------

#### Library for AMQP and MQTT clients

There are different libraries for many languages for interacting with protocol AMQP and MQTT you can use what you want. For JavScript we used this [library](https://github.com/squaremo/amqp.node).

-----------------------------------------------------------------------------------------------------------------------------

## Temperature Example

The temperature example aims to demonstrate the potential of the suggested architecture to collect data from IoT sensors and logging this data on an external data  manager.

The application is composed by four functions:

* **[Consume Temperature Function](#consume-temperature-function)**, is triggered by a new AMQP message on the queue "iot/sensors" for a routing key "temperature".
* **[Send Temperature Function](#send-temperature-function)**, sends a new temperature value on the AMQP to the queue "iot/sensors" for a routing key "temperature".
* **[Logger](#logger)**, logs the invocation of the consume function, this functions is in waiting for a new messages on the queue AMQP "iot/logs". Is a JavaScript function for Node.js and is executed on an external machine. 
* **[IoT Client](#iot-client)**, an example IoT client written in JavaScript and executed on Node.js. This function generates new temperature event (containing the temperature value) on the AMQP to the queue "iot/sensors" for a routing key "temperature". The IoT client client could be any client that support the AMQP transport protocol.

The first step to do is access to the Nuclio dashboard and create a new project named IOT.

### Temperature Consume Function

The Temperature Consume Function is written in pure JavaScript and exploits the _amqplib_ JavaScript library to communicate on the "iot/logs" queue the invocation of the function. 
The JavaScript code is the following:
```javascript
var amqp = require('amqplib');
        var FUNCTION_NAME = "amqpconsume";
        function send_feedback(msg){
            var q = 'iot/logs';
            amqp.connect('amqp://guest:guest@172.16.15.52:5672').then(function(conn) {
                return conn.createChannel().then(function(ch) {
                    var ok = ch.assertQueue(q, {durable: false});
                    return ok.then(function(_qok) {
                    ch.sendToQueue(q, Buffer.from(msg));
                    console.log(" [x] Sent '%s'", msg);
                    return ch.close();
                    });
                }).finally(function() { 
                        conn.close();
                    });
            }).catch(console.warn);
        }

        function bin2string(array){
          var result = "";
          for(var i = 0; i < array.length; ++i){
            result+= (String.fromCharCode(array[i]));
          }
          return result;
        }

        exports.handler = function(context, event) {
            var _event = JSON.parse(JSON.stringify(event));
            var _data = bin2string(_event.body.data);

            context.callback("feedback "+_data);

            console.log("TRIGGER "+_data);
            send_feedback("Invoked Function "+FUNCTION_NAME+" on "+_data);
        };
```

The function is deployed using the Docker compose specifics for Nuclio. This is achieved by define a new yaml file that declares all functions specifications and source code. The source code of the function (the JavaScript code) is encoded in base64 and copied in the attribute "functionSourceCode",  moreover, is defined a new trigger on the amqp protocol that allows to automatically invoke the function when a new message is coming on the queue "iot/sensors" for the routing key "temperature". Since the functions exploits the amqplib in the "commands" attribute is added the command to install on Node.js the amqplib (npm install amqplib).

```yaml
apiVersion: "nuclio.io/v1"
kind: Function
metadata:
  name: amqpconsume
  namespace: nuclio
spec:
  handler: "main:handler"
  description: "Function the is called when a new message is arrived on the iot/sensors/temperature queue, //the function send back a feedback on the iot/logs queue."
  runtime: nodejs
  image: "nuclio/processor-amqpconsume:latest"
  minReplicas: 1
  maxReplicas: 1
  targetCPU: 75
  triggers:
    amqp:
      class: ""
      kind: rabbit-mq
      url: "amqp://guest:guest@172.16.15.52:5672"
      attributes:
        exchangeName: iot/sensors
        queueName: iot/sensors
        topics:
          - temeprature
  build:
    functionSourceCode: dmFyIGFtcXAgPSByZXF1aXJlKCdhbXFwbGliJyk7CiAgICAgICAgdmFyIEZVTkNUSU9OX05BTUUgPSAiYW1xcGNvbnN1bWUiOwogICAgICAgIGZ1bmN0aW9uIHNlbmRfZmVlZGJhY2sobXNnKXsKICAgICAgICAgICAgdmFyIHEgPSAnaW90L2xvZ3MnOwogICAgICAgICAgICBhbXFwLmNvbm5lY3QoJ2FtcXA6Ly9ndWVzdDpndWVzdEAxNzIuMTYuMTUuNTI6NTY3MicpLnRoZW4oZnVuY3Rpb24oY29ubikgewogICAgICAgICAgICAgICAgcmV0dXJuIGNvbm4uY3JlYXRlQ2hhbm5lbCgpLnRoZW4oZnVuY3Rpb24oY2gpIHsKICAgICAgICAgICAgICAgICAgICB2YXIgb2sgPSBjaC5hc3NlcnRRdWV1ZShxLCB7ZHVyYWJsZTogZmFsc2V9KTsKICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2sudGhlbihmdW5jdGlvbihfcW9rKSB7CiAgICAgICAgICAgICAgICAgICAgY2guc2VuZFRvUXVldWUocSwgQnVmZmVyLmZyb20obXNnKSk7CiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIiBbeF0gU2VudCAnJXMnIiwgbXNnKTsKICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2guY2xvc2UoKTsKICAgICAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKSB7IAogICAgICAgICAgICAgICAgICAgICAgICBjb25uLmNsb3NlKCk7CiAgICAgICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgIH0pLmNhdGNoKGNvbnNvbGUud2Fybik7CiAgICAgICAgfQoKICAgICAgICBmdW5jdGlvbiBiaW4yc3RyaW5nKGFycmF5KXsKICAgICAgICAgIHZhciByZXN1bHQgPSAiIjsKICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSl7CiAgICAgICAgICAgIHJlc3VsdCs9IChTdHJpbmcuZnJvbUNoYXJDb2RlKGFycmF5W2ldKSk7CiAgICAgICAgICB9CiAgICAgICAgICByZXR1cm4gcmVzdWx0OwogICAgICAgIH0KCiAgICAgICAgZXhwb3J0cy5oYW5kbGVyID0gZnVuY3Rpb24oY29udGV4dCwgZXZlbnQpIHsKICAgICAgICAgICAgdmFyIF9ldmVudCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTsKICAgICAgICAgICAgdmFyIF9kYXRhID0gYmluMnN0cmluZyhfZXZlbnQuYm9keS5kYXRhKTsKCiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2soImZlZWRiYWNrICIrX2RhdGEpOwoKICAgICAgICAgICAgY29uc29sZS5sb2coIlRSSUdHRVIgIitfZGF0YSk7CiAgICAgICAgICAgIHNlbmRfZmVlZGJhY2soIkludm9rZWQgRnVuY3Rpb24gIitGVU5DVElPTl9OQU1FKyIgb24gIitfZGF0YSk7CiAgICAgICAgfTs=
    commands:
      - 'npm install amqplib'
    codeEntryType: sourceCode
  platform: {}
```

For deploying the function you can access, from the Nuclio dashboard, to the project IOT and create new function. When the system ask to create new function you have to select the import form yaml, and load the file "iot/temperature/amqpconsume.yaml". At this point the dashboard show you the function IDE where it is needed to deploy on the system the function pressing the button "Deploy".

The same procedure could be achieved but create new function and copy the JavaScript code in the edidor part, and create the new trigger for the AMQP messages.

### Send Temperature Function
The Send Temperature Function is written in pure JavaScript and exploits the _amqplib_ JavaScript library to communicate on the "iot/sensors" queue  for routing key "temperature" a new temperature value.

The JavaScript code is the following:

```javascript
var amqp = require('amqplib');

exports.handler = function(context, event) {
    var key = 'temperature';
    var message = '20';

    amqp.connect('amqp://guest:guest@172.16.15.52:5672').then(function(conn) {
    return conn.createChannel().then(function(ch) {
        var ex = 'iot/sensors';
        var ok = ch.assertExchange(ex, 'topic', {durable: false});
        return ok.then(function() {
            ch.publish(ex, key, Buffer.from(message));
            console.log(" [x] Sent %s:'%s'", key, message);
            return ch.close();
        });
    }).finally(function() { conn.close();  })
    }).catch(console.log);
    
    context.callback('send '+message);
};
```
The function is deployed on Nuclio in the same way of the Consume Temperature Function. 

```yaml
apiVersion: "nuclio.io/v1"
kind: Function
metadata:
  name: amqpevent
  namespace: nuclio
spec:
  handler: "main:handler"
  description: "Function that generate an event on the AMQP queue sending a temperature value."
  runtime: nodejs
  image: "nuclio/processor-amqpevent:latest"
  minReplicas: 1
  maxReplicas: 1
  targetCPU: 75
  build:
    functionSourceCode: dmFyIGFtcXAgPSByZXF1aXJlKCdhbXFwbGliJyk7CgpleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihjb250ZXh0LCBldmVudCkgewogICAgdmFyIGtleSA9ICd0ZW1wZXJhdHVyZSc7CiAgICB2YXIgbWVzc2FnZSA9ICcyMCc7CgogICAgYW1xcC5jb25uZWN0KCdhbXFwOi8vZ3Vlc3Q6Z3Vlc3RAMTcyLjE2LjE1LjUyOjU2NzInKS50aGVuKGZ1bmN0aW9uKGNvbm4pIHsKICAgIHJldHVybiBjb25uLmNyZWF0ZUNoYW5uZWwoKS50aGVuKGZ1bmN0aW9uKGNoKSB7CiAgICAgICAgdmFyIGV4ID0gJ2lvdC9zZW5zb3JzJzsKICAgICAgICB2YXIgb2sgPSBjaC5hc3NlcnRFeGNoYW5nZShleCwgJ3RvcGljJywge2R1cmFibGU6IGZhbHNlfSk7CiAgICAgICAgcmV0dXJuIG9rLnRoZW4oZnVuY3Rpb24oKSB7CiAgICAgICAgICAgIGNoLnB1Ymxpc2goZXgsIGtleSwgQnVmZmVyLmZyb20obWVzc2FnZSkpOwogICAgICAgICAgICBjb25zb2xlLmxvZygiIFt4XSBTZW50ICVzOiclcyciLCBrZXksIG1lc3NhZ2UpOwogICAgICAgICAgICByZXR1cm4gY2guY2xvc2UoKTsKICAgICAgICB9KTsKICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKSB7IGNvbm4uY2xvc2UoKTsgIH0pCiAgICB9KS5jYXRjaChjb25zb2xlLmxvZyk7CiAgICAKICAgIGNvbnRleHQuY2FsbGJhY2soJ3NlbmQgJyttZXNzYWdlKTsKfTs=
    commands:
      - 'npm install amqplib'
    codeEntryType: sourceCode
  platform: {}
```
For deploying the function you can access, from the Nuclio dashboard, to the project IOT and create new function. When the system ask to create new function you have to select the import form yaml, and load the file "iot/temperature/amqpevent.yaml". At this point the dashboard show you the function IDE where it is needed to deploy on the system the function pressing the button "Deploy".

The same procedure could be achieved but create new function and copy the JavaScript code in the edidor part, and create the new trigger for the AMQP messages.

**TIP** For invoking the function is possible to press the button "TEST" in the dashboard. Moreover, in Nuclio is possible to invoke function by generating an HTTP event, the following command invoke the function:
```
curl -X POST -H "Content-Type: application/text"  http://localhost:39823
```
Each function in Nuclio is identified by the serving port, you can see the serving port in the dashboard (change the port in the url http://localhost:PORT).

### Logger

The logger function is written in pure JavaScript and exploits the _amqplib_ JavaScript library to receive messages on the queue "iot/logs". 

```javascript
var amqp = require('amqplib');

amqp.connect('amqp://guest:guest@172.16.15.52:5672').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('iot/logs', {durable: false});

    ok = ok.then(function(_qok) {
      return ch.consume('iot/logs', function(msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).catch(console.warn);
```

In order to execute this function is require Node.js and the amqlib library. The following commands execute the logger:

```sh
$ npm install amqlib
$ node logger.js
```

### IoT Client

The IoT Client could be written in any language for any platform that support the AMQP protocol.  In order to emphasize that the following JavaScript code allow to send on the "iot/sensors" queue for the routing key "temperature" a number of random temperature values (the first integer argument of the function).  The Client is written in pure JavaScript and exploits the _amqplib_ JavaScript library to communicate on the "iot/sensors" queue  for routing key "temperature" a new temperature value.


```javascript
var args = process.argv.slice(2);
console.log(args);
var amqp = require('amqplib');
for (var i = 0; i < args[0]; i++) {
       var key = 'temperature';
       amqp.connect('amqp://guest:guest@172.16.15.52:5672').then(function(conn) {
       return conn.createChannel().then(function(ch) {
           var ex = 'iot/sensors';
           var ok = ch.assertExchange(ex, 'topic', {durable: false});
           return ok.then(function() {
                var message = Math.floor(Math.random()*20);
               ch.publish(ex, key, Buffer.from(message.toString()));
               console.log(" [x] Sent %s:'%s'", key, message.toString());
               return ch.close();
           });
       }).finally(function() { conn.close();  })
       }).catch(console.log);
}
```

In order to execute this function is require Node.js and the amqlib library. The following commands execute the logger:

```sh
$ npm install amqlib
$ node send_temperature.js
```

-----------------------------------------------------------------------------------------------------------------------------------


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

