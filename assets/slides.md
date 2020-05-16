---
marp: true
size: 4k
paginate: true

---

<style>
img[alt~="center"] {
  display: block;
  margin: 0 auto;
}
</style>

[topo]: https://raw.githubusercontent.com/spagnuolocarmine/spagnuolocarmine.github.io/master/assets/files/myworkingspace/img/topo.png
[iotarch]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/iot-architecture.png
[android]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtt_android.png
[nuclioproject]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/nuclio_project.png
[serverless]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/serverless.png
[faas]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/faas.png
[iot]: /home/matdau/git/serverless-computing-for-iot/assets/iot.png

<!-- 
_class: invert 
_paginate: false
-->

# Serverless Computing for IoT <!--fit-->

Project Homeworks Lab.

_ISISLab - Università degli Studi di Salerno_

<br>


- Prof. Vittorio Scarano
- Carmine Spagnuolo, PhD
- Matteo D'Auria, PhD Student


<br>

![h:150][topo]


---

# Homework support organization

- We talk (asynchronously) on the 
  - Discord ISISLab community [![h:50](https://img.shields.io/discord/693092516286693387.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/BTt5fUp)
  - channel CLASSES ```#serverless``` 
- or you can schedule an online meeting (synchronously) during the official course hours (on the same platform).


---

# Serverless Computing

- Serverless computing is a cloud-computing execution model in which the cloud provider acts as the server, dynamically managing the allocation of machine resources.  

![h:400 center][serverless]

---

# Function as a Service

- A category of cloud computing services that allow customers to:
  -  develop,
  -  run,
  -  and manage application functionalities
-  without the complexity of building and maintaining the infrastructure typically associated with developing and launching an app.
<!--- - Building an application following this model is one way of achieving a "serverless" architecture, and is typically used when building microservices applications.
-->
![bg right:20%][faas]

---

# The Internet of Thing

- The Internet of things (IoT) is the network of physical devices, vehicles, home appliances, and other items embedded with electronics, software, sensors, actuators, and connectivity which enables these things to connect, collect and exchange data.

- We are interest to efficiently collect and elaborate this data, and produce new data as answer to particular condition computed from the data received. 
![bg right:20%][iot]

---

# Why this tutorial?

- Designed to show how to build a computing architecture, based on open-source software, that allows the users to exploit Function-as-service model in the context of IoT.
- The idea is provide a system which allows to deploy functions that are trigged by events generated from small devices such as sensors and  mobile (IoT devices), commonly these devices communicates using message-passing, in particular on dedicated protocols as AMQP or MQTT.  
- This tutorial provides examples that deploy a function able to log the temperature value received by a sensor on the AMQP protocol.

---

# Serverless Computing Application Architecture

![][iotarch]

---

# Prerequisites
- OS: 
    - Ubuntu 18.04 LTS
- Software:
    - Docker and Docker Compose (Application containers engine)
    - Nuclio (Serverless computing provider)
    - RabbitMQ (AMQP and MQTT message broker)
    - Node.js

---

<!---
## Installation

This tutorial is made on top of one local machine an Linux Ubuntu 18.04 LTS machine. 

-
-->


# Docker

- Docker is a tool designed to make it easier to create, deploy, and run applications by using containers. 
- Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package. 
- Thanks to the container, the developer can rest assured that the application will run on any other Linux machine regardless of any customized settings that machine might have that could differ from the machine used for writing and testing the code.
 
---
# Docker
- In a way, Docker is a bit like a virtual machine. But unlike a virtual machine, rather than creating a whole virtual operating system, Docker allows applications to use the same Linux kernel as the system that they're running on and only requires applications be shipped with things not already running on the host computer. This gives a significant performance boost and reduces the size of the application.

- Docker is used in the architecture to deploy the function in an application container, each function is a Docker container that is listening on a socket port and can be invoked by an HTTP request, or by other triggers.

---

# Docker Installation


Install Docker using the Docker CE installation [guide](https://docs.docker.com/install/linux/docker-ce/ubuntu/#extra-steps-for-aufs)

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

---
# Docker IMPORTANT FIX

- Ubuntu 18.04 changed to use systemd-resolved to generate /etc/resolv.conf. Now by default it uses a local DNS cache 127.0.0.53. That will not work inside a container, so Docker will default to Google's 8.8.8.8 DNS server, which may break for people behind a firewall.
<!--- Refers to the [Stackoverflow discussion](https://stackoverflow.com/questions/20430371/my-docker-container-has-no-internet).-->

```sh
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```
---


# Docker Compose

- Compose is a tool for defining and running multi-container Docker applications. 
- With Compose, you use a YAML file to configure your application’s services.

<!--- **TIP** Docker compose is the technology used by Nuclio to easily create, build and deploy Docker application containers (the functions in this case).-->

- Install Docker Compose using the Docker Compose installation [guide](https://docs.docker.com/compose/install/#install-compose).

```sh
$ sudo curl -L "https://github.com/docker/compose/releases/download/
1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

---

# Nuclio (High-Performance Serverless event and data processing platform)

- Nuclio  is a new "serverless" project, derived from Iguazio's elastic data life-cycle management service for high-performance events and data processing. 
- The simplest way to explore Nuclio is to run its graphical user interface (GUI) of the Nuclio dashboard. 

- The Nuclio documentation is available at [this link](https://nuclio.io/docs/latest/).

---
# Nuclio 

- Start [Nuclio](https://github.com/nuclio/nuclio) using a docker container.

```sh
$ docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64
```
- Browse to http://localhost:8070, create a project, and add a function. 
- When run outside of an orchestration platform (for example, Kubernetes or Swarm), the dashboard will simply deploy to the local Docker daemon.

-  Nuclio provide also the nctcl application client that allows to basically execute the same operation of Nuclio dashboard.

---

# RabbitMQ 

- RabbitMQ is lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols. RabbitMQ can be deployed in distributed and federated configurations to meet high-scale, high-availability requirements.

- Start [RabbitMQ](https://www.rabbitmq.com) instance with MQTT enabled using docker.

```sh
$ docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt 
```

- Browse to http://localhost:9000, and login using username: guest and password: guest, to access to the RabbitMQ managment, where is possible to visualize the message queues and the broker status.

---

# Library for AMQP and MQTT clients

- There are different libraries for many languages for interacting with protocol AMQP and MQTT you can use what you want. 
- For JavScript AMQP we used this [library](https://github.com/squaremo/amqp.node), while for JavaScript MQTT we used this [library](https://github.com/mqttjs/MQTT.js).


<!---
## Examples

- [Temperature using AMQP](https://github.com/spagnuolocarmine/serverless-computing-for-iot/blob/master/iot/amqp/temperature)
- [Temperature using MQTT](https://github.com/spagnuolocarmine/serverless-computing-for-iot/blob/master/iot/mqtt/temperature)

-->

- We used a general purpose [MQTT client](https://play.google.com/store/apps/details?id=in.dc297.mqttclpro) for Android.

---


# Docker TIPS

In this section are presentented several Docker useful commands:
- Docker container ID: ```sudo docker ps -a```, displays all deployed containers, rember that functions are Docker containers, the IMAGE field is the function name and version, while the CONTAINER ID is the ID of the function. In this view is also possible to see the listening port for the function in the field PORTS.
- Docker Logs: ```sudo docker logs CONTAINER ID```, displays the STDOUT and STDERR of the associated container.
- Docker Kill: ```sudo docker kill CONTAINER ID```, kills the associated container.
- Docker Remove: ```sudo docker rm CONTAINER ID```, removes the associated container.

---

<!-- 
_class: invert 
_paginate: false
-->

# MQTT Temperature Example <!--fit-->


<br>

![h:150][topo]


---

# First Step

- The first step to do is access to the Nuclio dashboard and create a new project named IOT-MQTT.

![h:450 center][nuclioproject]

---

# MQTT Temperature Example

The temperature example aims to demonstrate the potential of the suggested architecture to collect data from IoT sensors and logging this data on an external data manager.

---

# MQTT Temperature Example

The application is composed by four functions:

* **[Consume Temperature Function](#consume-temperature-function)**, is triggered by a new MQTT message on the topic "iot/sensors/temperature".
* **[Send Random Temperature Function](#send-random-temperature-function)**, sends a new temperature value on the MQTT on the topic "iot/sensors/temperature".
* **[Logger](#logger)**, logs the invocation of the consume function, this functions is in waiting for a new messages on the queue AMQP "iot/logs". Is a JavaScript function for Node.js and is executed on an external machine. 
* **[IoT Client](#iot-client)**, a general purpose Android MQTT Client.

---

# Temperature Consume Function

<!--- The Temperature Consume Function is written in pure JavaScript and exploits the _amqplib_ JavaScript library to communicate on the "iot/logs" queue the invocation of the function. 
-->
```javascript
var amqp = require('amqplib');
        var FUNCTION_NAME = "mqttconsume";
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
```

---
# Temperature Consume Function

```
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
            send_feedback("Invoked Function MQTT: "+FUNCTION_NAME+" received "+_data);
        };
```
---

# Temperature Consume Function

- The function is deployed using the Docker compose specifics for Nuclio. 
- This is achieved by define a new .yaml file that declares all functions specifications and source code. 
- The source code of the function (the JavaScript code) is encoded in base64 and copied in the attribute "functionSourceCode".
- A new trigger on the mqtt protocol that allows to automatically invoke the function when a new message is coming on the topic "iot/sensors/temperature".
-  Since the functions exploits the amqplib in the "commands" attribute is added the command to install on Node.js the amqplib (npm install amqplib).

---

# Temperature Consume Function

```yaml
apiVersion: "nuclio.io/v1"
kind: Function
metadata:
  name: mqttconsume
  namespace: nuclio
spec:
  handler: "main:handler"
  description: "Function the is called when a new message is arrived on the iot/sensors/temperature queue, //the function send back a feedback on the iot/logs queue."
  runtime: nodejs
  image: "nuclio/processor-mqttconsume:latest"
  minReplicas: 1
  maxReplicas: 1
  targetCPU: 75
  triggers:
    myMqttTrigger:
      kind: "mqtt"
      url: "guest:guest@172.16.15.52:1883"
      attributes:
          subscriptions:
          - topic: iot/sensors/temperature
            qos: 0
  build:
    functionSourceCode: <base64 of the code>
    commands:
      - 'npm install amqplib'
    codeEntryType: sourceCode
  platform: {}
```

---
# Temperature Consume Function deploy

- For deploying the function you can access, from the Nuclio dashboard, to the project IOT-MQTT and create new function. 
- When the system ask to create new function you have to select the import form yaml, and load the file "iot/mqtt/temperature/amqpconsume.yaml". At this point the dashboard show you the function IDE where it is needed to deploy on the system the function pressing the button "Deploy".

- The same procedure could be achieved but create new function and copy the JavaScript code in the edidor part, and create the new trigger for the MQTT messages.

---

# Send Random Temperature Function
<!---
The Send Random Temperature Function is written in pure JavaScript and exploits the _MQTT.js_ JavaScript library to communicate on the topic "iot/sensors/temperature".
-->

```javascript
var mqtt = require('mqtt'), url = require('url');

var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://guest:guest@172.16.15.52:1883');
var auth = (mqtt_url.auth || ':').split(':');
var url = "mqtt://" + mqtt_url.host;

var options = {
  port: mqtt_url.port,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: auth[0],
  password: auth[1],
};
...
```
---
# Send Random Temperature Function
```javascript
...
exports.handler = function(context, event) {
    var client = mqtt.connect(url, options);
    
    client.on('connect', function() {
        client.publish('iot/sensors/temperature', (Math.floor(Math.random()*30)).toString(), function() {
                    client.end(); 
                    context.callback('MQTT Message Sent');
                } );
                            
        });        
    
};
```

---
# Send Random Temperature Function .yaml file

```yaml
apiVersion: "nuclio.io/v1"
kind: Function
metadata:
  name: mqttrandomtemperature
  namespace: nuclio
spec:
  handler: "main:handler"
  description: "Function to generate an event on the MQTT queue sending a temperature value."
  runtime: nodejs
  image: "nuclio/processor-mqtt-random-temperature:latest"
  minReplicas: 1
  maxReplicas: 1
  targetCPU: 75
  build:
    functionSourceCode: <base64 of the code>
    commands:
      - 'npm install mqtt'
    codeEntryType: sourceCode
  platform: {}

```

---

# Send Random Temperature Function using Dashboard

- For deploying the function you can access, from the Nuclio dashboard, to the project IOT-MQTT and create new function. 
- When the system ask to create new function you have to select the import form yaml, and load the file "iot/temperature/amqpevent.yaml". 
- At this point the dashboard show you the function IDE where it is needed to deploy on the system the function pressing the button "Deploy".

- The same procedure could be achieved but create new function and copy the JavaScript code in the edidor part.

---
# Invoke Send Random Temperature Function


- For invoking the function is possible to press the button "TEST" in the dashboard. 

- Moreover, in Nuclio is possible to invoke function by generating an HTTP event, the following command invoke the function:

```sh
curl -X POST -H "Content-Type: application/text"  http://localhost:39823
```

**Note**: Each function in Nuclio is identified by the serving port, you can see the serving port in the dashboard (change the port in the url http://localhost:PORT).

---

# Logger
<!---
The logger function is written in pure JavaScript and exploits the _amqplib_ JavaScript library to receive messages on the queue "iot/logs". 
-->

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

---

# Execute the Logger

In order to execute this function is require Node.js and the amqlib library. The following commands execute the logger:

```sh
$ npm install amqplib
$ node logger.js
```

---

# IoT Client

- For this example we have used a general purpose  [MQTT Android Client](https://play.google.com/store/apps/details?id=in.dc297.mqttclpro). 
- In this app you can connect to the RabbitMQ broker using the protocol MQTT (just create new connection to the IP where the RabbitMQ are running). 
- After created the connection you can easily send values on some topic.

![width:200px][android]