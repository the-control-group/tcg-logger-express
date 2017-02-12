# TCG Express Logger Module

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
	logStream: <'debug', 'json', or false>, // Debug for human readable logs to stdout, false to disable stdout, and json for ...well... json
	logFile: '/absolute/path/to/logfile' // Pass a string absolute path for logging to a file, leave empty to disable
});
```
