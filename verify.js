const verify = function (req, res, next) {
  console.log(req);
  next();
};

module.exports = verify;
