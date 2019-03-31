const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const passwordPage = (req, res) => {
  res.render('passwordChange', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

	// force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

	// cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const passwordChange = (request, response) => {
  const req = request;
  const res = response;

	// cast to strings to cover up some security flaws
  req.body.username = `${req.session.account.username}`;
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.oldPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password' });
    }


    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const accountData = {
        username: req.body.username,
        salt,
        password: hash,
        _id: req.session.account._id,
      };


      Account.AccountModel.removeByUsername(req.body.username, (errr, accountt) => {
        if (errr || !accountt) {
          return res.status(401).json({ error: 'Failed to change' });
        }
        return accountt;
      });

      const newAccount = new Account.AccountModel(accountData);

      const savePromise = newAccount.save();

      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(newAccount);
        res.json({ redirect: '/maker' });
      });

      savePromise.catch((errrr) => {
        console.log(errrr);

        if (errrr.code === 11000) {
          return res.status(400).json({ error: 'Username already in use.' });
        }

        return res.status(400).json({ error: 'An error occured' });
      });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.passwordPage = passwordPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.passwordChange = passwordChange;
module.exports.getToken = getToken;
