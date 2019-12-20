import * as express from 'express';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import { notFound, prodError } from './errorhandler/errorhandler';
import { router } from './routes/routes';
import * as path from 'path';
import { guard } from './middleware/gaurd';

dotenv.config({ path: 'application.env' });
const app = express();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(guard);
app.use(fileUpload());
app.use('/api', router);
app.use(notFound);
app.use(prodError);


const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
