import dotenv from 'dotenv';
import app from './infrastructure/api/app';

dotenv.config();

const port = 3010;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
