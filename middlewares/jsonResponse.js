module.exports = (req, res, next) => {
  res.jsonResponse = (status, payload = {}) => {
    if (status < 400) {
      return res
        .status(status)
        .json({ status: true, token: { AccessToken: req.token }, ...payload });
    }
    return res.status(status).json({ status: false, ...payload });
  };
  next();
};
