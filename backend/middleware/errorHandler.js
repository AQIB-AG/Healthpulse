// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) {
    return;
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
}

