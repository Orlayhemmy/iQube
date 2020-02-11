import * as express from 'express';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import { notFound, prodError } from './errorhandler/errorhandler';
import { router } from './routes/routes';
import * as path from 'path';
import { guard } from './middleware/gaurd';
import * as SwaggerDoc from './openapi.json';
import * as SwaggerUI from 'swagger-ui-express';
import * as morgan from 'morgan';
import { stream } from './config/winston';

dotenv.config({ path: 'application.env' });
const app = express();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import './middleware/notificationEmitter'

app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(SwaggerDoc));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined', { stream }));
app.use(guard);
app.use(fileUpload());
app.use('/api', router);
app.use(notFound);
app.use(prodError);

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
