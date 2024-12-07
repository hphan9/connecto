import express from 'express';

const signUpRouter = express.Router();

signUpRouter.post('/api/auth/signup', (req, res) => {
  if (!req.body.email) {
    res.status(422).send({});
  }
  res.send({});
});

export default signUpRouter;
