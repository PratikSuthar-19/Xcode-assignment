export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details,
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details || null,
    });
  }

  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
}

