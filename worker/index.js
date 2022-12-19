const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000 // re-connect once a millisecond
})
const sub = redisClient.duplicate();

function fib(index) {
	if (index < 2) return 1;
	return fib(index - 1) + fib(index - 2);
}

/**
 * anytime we get a new value, insert the index and value to "values"
 */
sub.on('message', (channel, message) => {
	// hash key value
	redisClient.hset('values', message, fib(parseInt(message)));
})
sub.subscribe('insert'); // subscribe insert event
