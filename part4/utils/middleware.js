const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const reqLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ err: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ err: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      err: 'invalid token',
    });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      err: 'token expired',
    });
  }

  next(err);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer '))
    req.token = authorization.substring(7);
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    req.user = user;
  }

  next();
};

module.exports = {
  reqLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
