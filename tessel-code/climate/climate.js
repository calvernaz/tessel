var tessel = require('tessel');
var mqtt = require('mqtt')
var climatelib = require('climate-si7020');
var conf = require('./env.json')
// Tessel Port
var climate = climatelib.use(tessel.port['B']);
// MQTT broker
var client  = mqtt.connect(conf.broker.url)

climate.on('ready', function () {
    setImmediate(function loop () {
	climate.readTemperature(function (err, temp) {
	    var message = { "cid": conf.sensor.cid, 
			    "sensors": [{
				"name": "temperature",
				"idx": 1,
				"value": temp.toFixed(2)
			    }]
			  };
	    
	    client.publish(conf.broker.topic, JSON.stringify(message));
	    setTimeout(loop, 60000);
	});
    });
});

climate.on('error', function(err) {
    console.log('error connecting module', err);
});
