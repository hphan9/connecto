import app from './app';

app.get('*', (req, res) => {
  res.status(200).send({});
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
