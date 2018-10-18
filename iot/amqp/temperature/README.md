
## AMQP Temperature Example

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

