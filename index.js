import express from 'express';

const port  = 8000;
const app = express();

app.all('/hello', (req, res, next) => {
  console.log('All');
  next();
});

const cBack1 = (req, res, next) => {
  console.log('callback', 1);
  next();
};

const cBack2 = (req, res, next) => {
  console.log('callback', 2);
  next();
};


app.get('/he(la)?llo', [cBack1, cBack2], (req, res) => {
  res.cookie('token', 'Sergei', {
    domain: '*',
    path: '/hello',
    secure: true,
    maxAge: 60000
  });
  res.send('Hello, world');
});

app.get(/.*a$/, (req, res) => {
  res.send('Hello regexp');
});

app.route('/user')
  .all((req, res, next) => {
    res.set('Content-Type', 'text/plain');
    res.type('application/json');
    res.append('Worning', 'code');
    console.log('/user');
    next();
  })
  .get((req, res) => res.send('Get /user') )
  .post((req, res) => res.send('Post /user') )

app.get('/rq', (req, res) => {
  // res.status(201).send({ success: true });
  res.status(202).json({ success: true });
});

app.get('/down', (req, res) => {
  res.download('./test.txt', 'tessssst.txt');
});

app.get('/redirect', (req, res) => {  
  res.redirect(301, '/user');
})



app.listen(port, () => {
  console.log(`Server has been started on http://localhost:${port}`);
});
