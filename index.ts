import express, { Request, Response, NextFunction } from 'express';
import { router as userRouter } from './users/users.js';

const port  = 8000;
const app = express();

app.use((req, res, next) => {
  console.log('Время поступления запроса: ', new Date().toString());
  next();
});

app.get('/hello', (req, res) => {
  throw new Error('Error!!!');
  res.send('Hello worls');
})

app.use('/users', userRouter);

// обработчик ошибки должен добавляться после всех обработчиков use
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).end(err.message);
});

app.listen(port, () => {
  console.log(`Server has been started on http://localhost:${port}`);
});
