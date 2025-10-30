export default function validate(schema) {
  return (req, res, next) => {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) return next(error);

    req.validated = value;
    next();
  };
}
