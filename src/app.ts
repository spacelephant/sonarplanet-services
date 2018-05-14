import * as express from 'express';
import { json } from 'body-parser';
import * as webpush from 'web-push';
import * as trackr from 'trackr-lib';
import * as CONFIG from 'config';

const app = express();

app.use('/api/v1/', require('./routers/router'));
app.listen(CONFIG.get('server.port'));

module.exports = app;
