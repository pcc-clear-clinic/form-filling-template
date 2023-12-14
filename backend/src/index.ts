import express from 'express';

const app = express();

app.get('/hello', (_req :any, res :any) => {
  res.send('Hello, World222!');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});