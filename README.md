# TCG Logger Module for Express

Built on [Bunyan](https://github.com/trentm/node-bunyan). Built-in Express middleware includes appending a child logger to each request and response times.

## Usage

Add directly to the app object for an easy to access application-wide logger. Using the middleware will add a child logger as `req.log` for each request, as well as track and log response times. Each request logger gets assigned a UUID for easy request tracking.

```JavaScript
const express = require('express'),
	Logger = require('tcg-logger');

const app = express();

app.log = new Logger();

app.use('/', app.log.middleware());
```

### Constructor API

Options are not required. Defaults to `'debug'` log stream only.

```JavaScript
const log = new Logger({
	// Debug for human readable logs to stdout, false to disable stdout, and json for ...well... json
	logStream: <'debug', 'json', false>,

	// Pass a string absolute path for logging to a file, leave empty to disable
	logFile: '/absolute/path/to/logfile',

	// Name to give the logger
	logName: 'TCG Logger',

	// Minimum log level - defaults to 'debug' for debug streams, 'info' for all others
	logLevel: <'debug', 'info', 'warn', 'error'>,

	// Custom Bunyan serializers - see https://github.com/trentm/node-bunyan#serializers for docs
	reqSerializer,
	resSerializer,
	errSerializer
});
```
