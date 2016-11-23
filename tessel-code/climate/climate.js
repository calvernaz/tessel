var tessel = require('tessel');
var mqtt = require('mqtt')
var climatelib = require('climate-si7020');


var climate = climatelib.use(tessel.port['B']);
var client  = mqtt.connect('tcp://192.168.1.10')

var conf = require('./env.json')

climate.on('ready', function () {
    setImmediate(function loop () {
	climate.readTemperature(function (err, temp) {
	    client.publish(conf.broker.topic, 
			   JSON.stringify({ "cid": conf.sensor.cid, 
					    "sensors": [{
						"name": "temperature",
						"idx": 1,
						"value": temp.toFixed(2)
					    }]
					  }));
	    setTimeout(loop, 60000);
	});
    });
});

climate.on('error', function(err) {
    console.log('error connecting module', err);
});
