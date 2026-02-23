const validate = (schemas) => (req, _res, next) => {
  const validations = [];
  const options = { abortEarly: false, stripUnknown: true };

  if (schemas.body) {
    validations.push(schemas.body.validateAsync(req.body, options));
  }

  if (schemas.params) {
    validations.push(schemas.params.validateAsync(req.params, options));
  }

  if (schemas.query) {
    validations.push(schemas.query.validateAsync(req.query, options));
  }

  Promise.all(validations)
    .then(() => next())
    .catch((error) => next(error));
};

module.exports = { validate };
