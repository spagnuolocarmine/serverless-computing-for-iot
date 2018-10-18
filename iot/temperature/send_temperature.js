/*
Copyright 2018 University of Salerno.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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