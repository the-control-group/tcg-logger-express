/**
* TCG Logger
*
* Class for creating a Bunyan logger with some added goodies
*/

const Bunyan = require('bunyan'),
	bunyanDebugStream = require('bunyan-debug-stream'),
	responseTime = require('response-time'),
	uuid = require('uuid');

// Custom serializer for the response object
function defaultResSerializer(res) {
	if (!res || !res.statusCode) return res;

	return {
		statusCode: res.statusCode,
		responseTime: res.responseTime,
		headers: res._headers
	};
}

// Custom serialize for the request object
function defaultReqSerializer(req) {
	if (!req || !req.connection) return req;

	const obj = {
		method: req.method,
		url: req.url,
		headers: req.headers,
		remoteAddress: req.connection.remoteAddress,
		remotePort: req.connection.remotePort
	};

	return obj;
}

// Error stack handler
function getFullErrorStack(err) {
	let ret = err.stack || err.toString();
	if (err.cause && typeof (err.cause) === 'function') {
		const cex = err.cause();
		if (cex) {
			ret += '\nCaused by: ' + getFullErrorStack(cex);
		}
	}
	return (ret);
}

// Custom Error serializer to encompass custom error types
function defaultErrSerializer(err) {
	if (!err || !err.stack) return err;

	const obj = Object.assign({}, err, {
		stack: getFullErrorStack(err)
	});

	return obj;
}

class Logger extends Bunyan {
	constructor({
		logStream = 'debug',
		logFile = '',
		logName = 'TCG Logger',
		logLevel = logStream === 'debug' ? 'debug' : 'info',
		reqSerializer = defaultReqSerializer,
		resSerializer = defaultResSerializer,
		errSerializer = defaultErrSerializer
	} = {}) {
		// Add streams based on config
		const consoleDebugStream = {
				level: logLevel,
				type: 'raw',
				stream: bunyanDebugStream({basepath: __dirname})
			},
			consoleJsonStream = {
				level: logLevel,
				stream: process.stdout
			},
			fileStream = {
				level: logLevel,
				path: logFile
			},
			logStreams = [];

		if(logStream === 'debug') logStreams.push(consoleDebugStream);
		if(logStream === 'json') logStreams.push(consoleJsonStream);
		if(logFile) logStreams.push(fileStream);

		super({
			name: logName,
			streams: logStreams,
			serializers: {
				req: reqSerializer,
				res: resSerializer,
				err: errSerializer
			}
		});
	}

	/**
	 * Overwrite the child prototype
	 */
	child(options = {}, simple) {
		return new Bunyan(this, options, simple);
	}

	/**
	 * Returns an array of middleware pertaining to the logger
	 */
	middleware() {

		return [
			(req, res, next) => {
				req.log = this.child({req_id: uuid.v4()});

				next();
			},
			responseTime((req, res, time) => {
				res.responseTime = time;
			})
		];
	}
}

module.exports = Logger;
