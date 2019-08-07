import * as express from 'express';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import * as cors from 'cors';
import { notFound, prodError } from './errorhandler/errorhandler';
import { router } from './routes/routes';
import { guard } from './middleware/gaurd';

dotenv.config({ path: 'application.env' });
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(guard);
app.use('/api', router);
app.use(notFound);
app.use(prodError);

const port = process.env.PORT || 6060;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
