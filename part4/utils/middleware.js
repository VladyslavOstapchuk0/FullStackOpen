const logger = require('./logger');

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

const errHandler = (err, req, res, next) => {
  logger.err(err.message);

  if (err.name === 'Casterr') {
    return res.status(400).send({ err: 'malformatted id' });
  } else if (err.name === 'Validationerr') {
    return res.status(400).json({ err: err.message });
  }

  next(err);
};

module.exports = {
  reqLogger,
  unknownEndpoint,
  errHandler,
};
