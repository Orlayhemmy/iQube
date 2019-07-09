import * as express from 'express';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import * as cors from 'cors';

dotenv.config({ path: 'application.env' });
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 6060;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
