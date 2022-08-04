const info = (...params) => {
  console.log(...params);
};

const err = (...params) => {
  console.err(...params);
};

module.exports = {
  info,
  err,
};
