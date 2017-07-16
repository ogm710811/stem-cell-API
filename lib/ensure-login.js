// ensure function to check if user is logged in to
// allow access to api data

function ensureLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      next();
      return;
    }

    res.status(401).json({ message: 'Unauthorized' });
}

module.exports = ensureLoggedIn;