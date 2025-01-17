export const authMiddleware = (req, res, next) => {
  console.log('Session:', req.session);
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};
