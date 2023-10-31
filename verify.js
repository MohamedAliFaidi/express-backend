const verify = function (req, res, next) {
  console.log(req.headers);
  next();
};

module.exports = verify;
