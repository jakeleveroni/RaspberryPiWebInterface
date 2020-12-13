import * as express from 'express';
import * as bodyParser from 'body-parser';
import {actionRouter} from './routes/raspberry-pi-action'

const app = express()
    .use(bodyParser.json())
    .use(actionRouter);

app.listen(4201, '', 0, () => {
    return console.log('My Node App listening on port 4201');
});
