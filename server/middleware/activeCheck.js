const activeCheck = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (!req.user.isActive) {
    return res.status(403).json({
      message: 'Account not activated. Please wait for admin approval.',
      code: 'INACTIVE_USER',
    });
  }
  next();
};

module.exports = activeCheck;
