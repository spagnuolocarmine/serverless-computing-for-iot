## MQTT Temperature Example

The temperature example aims to demonstrate the potential of the suggested architecture to collect data from IoT sensors and logging this data on an external data  manager.

The application is composed by four functions:

* **[Consume Temperature Function](#consume-temperature-function)**, is triggered by a new MQTT message on the topic "iot/sensors/temperature".
* **[Send Random Temperature Function](#send-random-temperature-function)**, sends a new temperature value on the MQTT on the topic "iot/sensors/temperature".
* **[Logger](#logger)**, logs the invocation of the consume function, this functions is in waiting for a new messages on the queue AMQP "iot/logs". Is a JavaScript function for Node.js and is executed on an external machine. 
* **[IoT Client](#iot-client)**, a general purpose Android MQTT Client.

The first step to do is access to the Nuclio dashboard and create a new project named IOT-MQTT.


### Temperature Consume Function

The Temperature Consume Function is written in pure JavaScript and exploits the _amqplib_ JavaScript library to communicate on the "iot/logs" queue the invocation of the function. 
The JavaScript code is the following:
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

The function is deployed using the Docker compose specifics for Nuclio. This is achieved by define a new yaml file that declares all functions specifications and source code. The source code of the function (the JavaScript code) is encoded in base64 and copied in the attribute "functionSourceCode",  moreover, is defined a new trigger on the mqtt protocol that allows to automatically invoke the function when a new message is coming on the topic "iot/sensors/temperature". Since the functions exploits the amqplib in the "commands" attribute is added the command to install on Node.js the amqplib (npm install amqplib).

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
    functionSourceCode: dmFyIGFtcXAgPSByZXF1aXJlKCdhbXFwbGliJyk7CiAgICAgICAgdmFyIEZVTkNUSU9OX05BTUUgPSAibXF0dGNvbnN1bWUiOwogICAgICAgIGZ1bmN0aW9uIHNlbmRfZmVlZGJhY2sobXNnKXsKICAgICAgICAgICAgdmFyIHEgPSAnaW90L2xvZ3MnOwogICAgICAgICAgICBhbXFwLmNvbm5lY3QoJ2FtcXA6Ly9ndWVzdDpndWVzdEAxNzIuMTYuMTUuNTI6NTY3MicpLnRoZW4oZnVuY3Rpb24oY29ubikgewogICAgICAgICAgICAgICAgcmV0dXJuIGNvbm4uY3JlYXRlQ2hhbm5lbCgpLnRoZW4oZnVuY3Rpb24oY2gpIHsKICAgICAgICAgICAgICAgICAgICB2YXIgb2sgPSBjaC5hc3NlcnRRdWV1ZShxLCB7ZHVyYWJsZTogZmFsc2V9KTsKICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2sudGhlbihmdW5jdGlvbihfcW9rKSB7CiAgICAgICAgICAgICAgICAgICAgY2guc2VuZFRvUXVldWUocSwgQnVmZmVyLmZyb20obXNnKSk7CiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIiBbeF0gU2VudCAnJXMnIiwgbXNnKTsKICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2guY2xvc2UoKTsKICAgICAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKSB7IAogICAgICAgICAgICAgICAgICAgICAgICBjb25uLmNsb3NlKCk7CiAgICAgICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgIH0pLmNhdGNoKGNvbnNvbGUud2Fybik7CiAgICAgICAgfQoKICAgICAgICBmdW5jdGlvbiBiaW4yc3RyaW5nKGFycmF5KXsKICAgICAgICAgIHZhciByZXN1bHQgPSAiIjsKICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSl7CiAgICAgICAgICAgIHJlc3VsdCs9IChTdHJpbmcuZnJvbUNoYXJDb2RlKGFycmF5W2ldKSk7CiAgICAgICAgICB9CiAgICAgICAgICByZXR1cm4gcmVzdWx0OwogICAgICAgIH0KCiAgICAgICAgZXhwb3J0cy5oYW5kbGVyID0gZnVuY3Rpb24oY29udGV4dCwgZXZlbnQpIHsKICAgICAgICAgICAgdmFyIF9ldmVudCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTsKICAgICAgICAgICAgdmFyIF9kYXRhID0gYmluMnN0cmluZyhfZXZlbnQuYm9keS5kYXRhKTsKCiAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2soImZlZWRiYWNrICIrX2RhdGEpOwoKICAgICAgICAgICAgY29uc29sZS5sb2coIlRSSUdHRVIgIitfZGF0YSk7CiAgICAgICAgICAgIHNlbmRfZmVlZGJhY2soIkludm9rZWQgRnVuY3Rpb24gTVFUVDogIitGVU5DVElPTl9OQU1FKyIgcmVjZWl2ZWQgIitfZGF0YSk7CiAgICAgICAgfTs=
    commands:
      - 'npm install amqplib'
    codeEntryType: sourceCode
  platform: {}
```

For deploying the function you can access, from the Nuclio dashboard, to the project IOT-MQTT and create new function. When the system ask to create new function you have to select the import form yaml, and load the file "iot/mqtt/temperature/amqpconsume.yaml". At this point the dashboard show you the function IDE where it is needed to deploy on the system the function pressing the button "Deploy".

The same procedure could be achieved but create new function and copy the JavaScript code in the edidor part, and create the new trigger for the MQTT messages.

### Send Random Temperature Function
The Send Random Temperature Function is written in pure JavaScript and exploits the _MQTT.js_ JavaScript library to communicate on the topic "iot/sensors/temperature".

The JavaScript code is the following:

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
The function is deployed on Nuclio in the same way of the Consume Temperature Function. 

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
    functionSourceCode: dmFyIG1xdHQgPSByZXF1aXJlKCdtcXR0JyksIHVybCA9IHJlcXVpcmUoJ3VybCcpOwoKdmFyIG1xdHRfdXJsID0gdXJsLnBhcnNlKHByb2Nlc3MuZW52LkNMT1VEQU1RUF9NUVRUX1VSTCB8fCAnbXF0dDovL2d1ZXN0Omd1ZXN0QDE3Mi4xNi4xNS41MjoxODgzJyk7CnZhciBhdXRoID0gKG1xdHRfdXJsLmF1dGggfHwgJzonKS5zcGxpdCgnOicpOwp2YXIgdXJsID0gIm1xdHQ6Ly8iICsgbXF0dF91cmwuaG9zdDsKCnZhciBvcHRpb25zID0gewogIHBvcnQ6IG1xdHRfdXJsLnBvcnQsCiAgY2xpZW50SWQ6ICdtcXR0anNfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnN1YnN0cigyLCA4KSwKICB1c2VybmFtZTogYXV0aFswXSwKICBwYXNzd29yZDogYXV0aFsxXSwKfTsKCmV4cG9ydHMuaGFuZGxlciA9IGZ1bmN0aW9uKGNvbnRleHQsIGV2ZW50KSB7CiAgICB2YXIgY2xpZW50ID0gbXF0dC5jb25uZWN0KHVybCwgb3B0aW9ucyk7CiAgICAKICAgIGNsaWVudC5vbignY29ubmVjdCcsIGZ1bmN0aW9uKCkgewogICAgICAgIGNsaWVudC5wdWJsaXNoKCdpb3Qvc2Vuc29ycy90ZW1wZXJhdHVyZScsIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMzApKS50b1N0cmluZygpLCBmdW5jdGlvbigpIHsKICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW5kKCk7IAogICAgICAgICAgICAgICAgICAgIGNvbnRleHQuY2FsbGJhY2soJ01RVFQgTWVzc2FnZSBTZW50Jyk7CiAgICAgICAgICAgICAgICB9ICk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICB9KTsgICAgICAgIAogICAgCn07
    commands:
      - 'npm install mqtt'
    codeEntryType: sourceCode
  platform: {}

```
For deploying the function you can access, from the Nuclio dashboard, to the project IOT-MQTT and create new function. When the system ask to create new function you have to select the import form yaml, and load the file "iot/temperature/amqpevent.yaml". At this point the dashboard show you the function IDE where it is needed to deploy on the system the function pressing the button "Deploy".

The same procedure could be achieved but create new function and copy the JavaScript code in the edidor part.

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

The IoT Client could be written in any language for any platform that support the MQTT protocol. For this example we have used a general purpose  [MQTT Android Client](https://play.google.com/store/apps/details?id=in.dc297.mqttclpro). In this app you can connect to the RabbitMQ broker using the protocol MQTT (just create new connection to the IP where the RabbitMQ are running). After created the connection you can easily send values on some topic.
<p align="center"><img src="/assets/mqtt_android.png" width="1000"/></p>
