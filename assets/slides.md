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
[iot]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/iot.png
[tempapp]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/temp_app.png
[function0]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/function0.png
[function1]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/function1.png
[function2]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/function2.png
[configuration]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/configuration.png
[trigger]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/trigger.png
[yaml1]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/yaml_1.png
[yaml2]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/yaml_2.png
[mqtt1]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqqt1.jpg
[mqtt2]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtt2.jpg
[mqtt3]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtt3.jpg
[mqtt4]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtt4.jpg
[mqtt5]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtt5.jpg
[mqtzer1]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtizer1.jpg
[mqtzer2]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtizer2.jpg
[mqtzer3]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtizer3.jpg
[mqtzer4]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtizer4.jpg
[mqtzer5]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtizer5.jpg
[mqtzer6]: https://raw.githubusercontent.com/spagnuolocarmine/serverless-computing-for-iot/master/assets/mqtzer6.jpg

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

# Labs organization

- We talk (asynchronously) on the 
  - Discord ISISLab community [![h:50](https://img.shields.io/discord/693092516286693387.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/BTt5fUp)
  - channel CLASSES ```#serverless``` 
- or you can schedule an online meeting (synchronously) during the official course hours (on the same platform).

[![ h:50](https://img.shields.io/badge/GitHub-serverless--computing--for--iot-blue)](https://github.com/spagnuolocarmine/serverless-computing-for-iot)

---

# Serverless Computing

- Serverless computing is a cloud-computing execution model in which the cloud provider acts as the server, dynamically managing the allocation of machine resources.  

![h:400 center][serverless]

---

# Function as a Service

- Cloud computing services that allow customers to:
  -  develop,
  -  run,
  -  and manage application functionalities
- **Advantage**: no complexity of building and maintaining the hardware/software infrastructure.
<!--- - Building an application following this model is one way of achieving a "serverless" architecture, and is typically used when building microservices applications.
-->
![bg right:20%][faas]

---

# The Internet of Thing (IoT)

- A network of physical devices, vehicles, home appliances, and other items embedded with electronics, software, sensors, actuators, and connectivity, which enables these things to connect, collect, and exchange data.

- **Course goal**:  
  - efficiently collect and elaborate data, produce new data as the answer to particular conditions computed from the data received. 
  - integrate different cloud services to build an IoT application by using only open-source software.  
![bg right:20%][iot]

---

# Lesson Objectives

- _**Design**_ a computing architecture, based on open-source software, that allows the users to exploit the Function-as-service model in the context of IoT.
- The system must allow to _**deploy**_ functions that are _**trigged**_ by events generated from small devices such as sensors and  mobile (IoT devices)
-  Use the _**message-passing**_ communication paradigm, in particular on dedicated protocols as AMQP or MQTT.  


---

# Open-source Architecture

![][iotarch]

---

# Architecture Components

- Ubuntu 18.04 LTS ![h:50](https://img.shields.io/github/forks/nodejs/node?style=social)
- Application containers engine Docker and Docker Compose ![h:50](https://img.shields.io/github/forks/docker/compose?style=social)
- Serverless computing provider Nuclio ![h:50](https://img.shields.io/github/forks/nuclio/nuclio?style=social)
 - AMQP and MQTT message broker RabbitMQ ![h:50](https://img.shields.io/github/forks/rabbitmq/rabbitmq-server?style=social)
- JavaScript Application runtime Node.js ![h:50](https://img.shields.io/github/forks/nodejs/node?style=social)

---

<!---
## Installation

This tutorial is made on top of one local machine an Linux Ubuntu 18.04 LTS machine. 

-
-->


# Docker ![h:100](https://avatars0.githubusercontent.com/u/5429470?s=200&v=4)

- Docker is a tool designed to make it easier to create, deploy, and run applications by using containers. 

![w:800](https://www.guruadvisor.net/images/numero17/docker/docker-architecture.png)

---

# Docker Installation ![h:100](https://avatars0.githubusercontent.com/u/5429470?s=200&v=4)


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
# Docker IMPORTANT FIX ![h:100](https://avatars0.githubusercontent.com/u/5429470?s=200&v=4)

- Ubuntu 18.04 changed to use systemd-resolved to generate /etc/resolv.conf.
-  Now by default it uses a local DNS cache 127.0.0.53. 
- It will not work inside a container, so Docker will default to Google's 8.8.8.8 DNS server, which may break for people behind a firewall.
<!--- Refers to the [Stackoverflow discussion](https://stackoverflow.com/questions/20430371/my-docker-container-has-no-internet).-->

```sh
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```
---


# Docker Compose ![h:100](https://avatars0.githubusercontent.com/u/5429470?s=200&v=4)

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

# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

- Nuclio is a new "serverless" project, derived from Iguazio's elastic data life-cycle management service for high-performance events and data processing. 
- The simplest way to explore Nuclio is to run its graphical user interface (GUI) of the Nuclio dashboard. 

- The Nuclio documentation is available at [this link](https://nuclio.io/docs/latest/).

---
# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

- Start [Nuclio](https://github.com/nuclio/nuclio) using a docker container.

```sh
$ docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/
docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64
```
- Browse to http://localhost:8070, create a project, and add a function. 
- When run outside of an orchestration platform (for example, Kubernetes or Swarm), the dashboard will simply deploy to the local Docker daemon.

-  Nuclio provide also the nctcl application client that allows to basically execute the same operation of Nuclio dashboard.

---


# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

**How to deploy functions in Nuclio using the Nuclio dashboard:**

![][function0]

---

# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

**How to deploy functions in Nuclio using the Nuclio dashboard:**

![h:400 center][function1]

---

# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

**How to deploy functions in Nuclio using the Nuclio dashboard:**

![h:400 w:800 center][function2]

---

# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

**How to deploy functions in Nuclio using the Nuclio dashboard:**

![h:400 w:800 center][configuration]

---

# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

**How to deploy functions in Nuclio using the Nuclio dashboard:**

![h:400 w:800 center][trigger]

---

# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

**How to deploy functions in Nuclio using the Nuclio dashboard and .yaml file:**

![h:400 w:800 center][yaml1]

---

# Nuclio ![h:100](https://github.com/nuclio/nuclio/raw/development/docs/assets/images/logo.png)

**How to deploy functions in Nuclio using the Nuclio dashboard and .yaml file:**

![h:400 w:800 center][yaml2]

---

# RabbitMQ ![h:100](https://avatars0.githubusercontent.com/u/96669?s=200&v=4)

- RabbitMQ is lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols. RabbitMQ can be deployed in distributed and federated configurations to meet high-scale, high-availability requirements.

- Start [RabbitMQ](https://www.rabbitmq.com) instance with MQTT enabled using docker.

```sh
$ docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt 
```

- Browse to http://localhost:9000, and login using username: guest and password: guest, to access to the RabbitMQ managment, where is possible to visualize the message queues and the broker status.

---

# AMQP and MQTT JS clients ![h:100](https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png)

- There are different libraries for many languages for interacting with protocol AMQP and MQTT you can use what you want. We use:
  - [AMQP 0-9-1](https://github.com/squaremo/amqp.node) for Javascript AMQP.
  - [MQTT.js](https://github.com/mqttjs/MQTT.js) for JavaScript MQTT.

We used a general purpose [MQTT client](https://play.google.com/store/apps/details?id=in.dc297.mqttclpro) for Android.

---


# Docker useful commands ![h:100](https://avatars0.githubusercontent.com/u/5429470?s=200&v=4)

- **Docker container ID**: ```sudo docker ps -a```
    - displays all deployed containers, remember that functions are Docker containers, the IMAGE field is the function name and version, while the CONTAINER ID is the ID of the function. In this view, it is also possible to see the listening port for the function in the field PORTS.
- **Docker Logs**: ```sudo docker logs CONTAINER ID```  
    - displays the STDOUT and STDERR of the associated container.
- **Docker Kill**: ```sudo docker kill CONTAINER ID```
    - kills the associated container.
- **Docker Remove**: ```sudo docker rm CONTAINER ID```
    - removes the associated container.

---



# MQTT Temperature Example <!--fit-->
<!-- 
_class: invert 
_paginate: false
-->
![h:500](https://cdn1.iconfinder.com/data/icons/internet-of-things-multicilor/512/Internet_of_things-ps_style-19-512.png) 

---

# Application Goals ![h:100](https://cdn1.iconfinder.com/data/icons/business-456/500/target-512.png) 


The temperature example aims to demonstrate the potential of the suggested architecture to collect data from IoT sensors and logging this data on an external data manager.

Scenario:
- We have several sensors that detect the temperature. 
- These sensors send these temperatures through the use of the MQTT protocol.
- These temperatures are processed in a Serverless way.

---

# First Step

- The first step to do is access to the Nuclio dashboard and create a new project named IOT-MQTT.

![h:450 center][nuclioproject]


---

# MQTT Temperature Example

The application is composed by four functions:

* **[ Temperature Consume Function](#consume-temperature-function)** triggered by a new MQTT message on the topic "iot/sensors/temperature".
* **[Send Random Temperature Function](#send-random-temperature-function)** sends a new temperature value on the MQTT on the topic "iot/sensors/temperature".
* **[Logger](#logger)** logs the invocation of the consume function, this function is in waiting for new messages on the queue AMQP "iot/logs". It is a JavaScript function for Node.js and is executed on an external machine. 
* **[IoT Client](#iot-client)** a general purpose Android MQTT Client.

---

# MQTT Temperature Example

![][tempapp]

---

# MQTT Temperature Example <!--fit-->
<!-- 
_class: invert 
_paginate: false
-->

### Temperature  Consume Function
![h:500](https://media0.giphy.com/media/d2ItDZZumUI6Y/200.gif) 

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

- We deploy using the Nuclio's Docker compose specifics: 
    - _.yaml_ file that declares all functions specifications and source code. 
    - function code (_JavaScript_) is encoded in base64 and copied in the attribute "functionSourceCode".
    - triggered with MQTT events on topic ```iot/sensors/temperature```.
- We use the _amqplib_ to send feedback to a log server:
     - "commands" attribute ➡️ ```npm install amqplib```.
- ⚠️ Change the user, password and IP for the log server and for the MQTT trigger (yaml file ```url``` field):
```
...
amqp.connect('amqp://guest:guest@172.16.15.52:5672').then(function(conn) ...
```
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
  description: "Function the is ..."
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
# Temperature Consume Function 

- From Nuclio dashboard create a new project ``` IOT-MQTT```.
- Create a new function ```Consume```
    - select import from yaml, and load the file ```iot/mqtt/temperature/amqpconsume.yaml```;
    - press **Deploy** (see the Error log).

- You can build your function manually by pasting the code, setting the MQTT trigger, and adding the _amqplib_ in the install commands:
    - ⚠️ MQTT trigger must be  ➡️ ```user:passowrd@IP:1883```; 
    - don't fill the user and password text field. 

---


# MQTT Temperature Example <!--fit-->
<!-- 
_class: invert 
_paginate: false
-->

### Send Random Temperature Function
![h:500](https://i.gifer.com/4n4S.gif) 

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

- ⚠️ Change the user, password and IP for the ```mqtt_url``` variable:
```
var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://guest:guest@172.16.15.52:1883');
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
# Send Random Temperature Function

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

# Send Random Temperature Function deploy


- Create a new function ```Produce```
    - select import from yaml, and load the file ```iot/mqtt/temperature/amqpevent.yaml```;
    - press **Deploy** (see the Error log).

- You can build your function manually by pasting the code, setting the MQTT trigger and adding the _amqplib_ in the install commands.

---

# Invoke Send Random Temperature Function


- For invoking the function is possible to press the button ```TEST``` in the dashboard. 

- Or invoke the function by generating an _**HTTP event**_ using the command line tool **curl**

```sh
curl -X POST -H "Content-Type: application/text"  http://localhost:39823
```

**Notice**: each Nuclio' function is identified by the serving port, you can see the serving port in the dashboard (change the port in the url http://localhost:PORT).

---

# MQTT Temperature Example <!--fit-->
<!-- 
_class: invert 
_paginate: false
-->

### Logger Server
![h:500](https://i.gifer.com/5SOi.gif) 

---

# Logger Server
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

- ⚠️ Change the user, password and IP for the ```mqtt_url``` variable:
```
...
amqp.connect('amqp://guest:guest@172.16.15.52:5672').then..
```

---

# Execute the Logger

Running the server using the Node.js runtime.

```sh
$ npm install amqplib
$ node logger.js
```

---

# Android IoT Client (1)

- [MQTT Client](https://play.google.com/store/apps/details?id=in.dc297.mqttclpro). 
- In this app, you can connect to the RabbitMQ broker using the protocol MQTT (create a new connection to the IP where the RabbitMQ is running). 
- After creating the connection, you can easily send or receive values on some topics.

---

# Android IoT Client (1) - Connection 

 ![width:175px][mqtt1]  ![width:175px][mqtt2] 


---

# Android IoT Client (1) - Subscribe and send/receive message
 ![width:175px][mqtt3]  ![width:175px][mqtt4]  ![width:175px][mqtt5] 


---

# Android IoT Client (2) 🌟

- [MQTIZER - Free MQTT Client](https://play.google.com/store/apps/details?id=com.sanyamarya.mqtizermqtt_client). 
- In this app, you can connect to the RabbitMQ broker using the protocol MQTT (create a new connection to the IP where the RabbitMQ is running). 
- After creating the connection, you can easily send or receive values on some topics.

---

# Android IoT Client (2) 🌟 - Connection

![width:175px][mqtzer1]  ![width:175px][mqtzer2] 

---

# Android IoT Client (2) 🌟 - Subscription and send/receive message

<!--- here I was wrong to rename the files when I uploaded them ... but I put them in order in the slide -->

![width:175px][mqtzer5]  ![width:175px][mqtzer3] ![width:175px][mqtzer4]  ![width:175px][mqtzer5] 
