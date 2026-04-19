/**
 * Request Logger Middleware
 * Logs incoming request details: method, path, timestamp, and IP.
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} — IP: ${ip}`);
  next();
};

module.exports = requestLogger;
