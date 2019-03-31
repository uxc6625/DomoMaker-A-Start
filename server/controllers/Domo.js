const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.credit) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    credit: req.body.credit,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  // Update Domo if it already exists
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An Error Occured' });
      // console.log('ERRRRRRRRRRRRRRRRR');
      // Update Domo
      /*
      Domo.findById(req.session.account._id, (err2, doc) => {
        if (err2) {
          return res.status(400).json({ error: 'An error occured' });
        }

        doc.set({ age: req.body.age });
        doc.set({ credit: req.body.credit });
        doc.save((err3, updatedDomo) => {
          if (err3) {
            return res.status(400).json({ error: 'An error occured' });
          }
          return res.send(updatedDomo);
        });

        return res.status(400).json({ error: 'An error occured' });
      });

      */
    }

    return res.status(400).json({ error: 'Domo already exists' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};


/*
const updateDomo = (req, res) => {
  Domo.DomoModel.findOneByOwner(req.session.account._id, (err, domo) => {
    if(err){
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    domo.age = req.body.age;
    domo.save();
  });
};


const updateDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.credit) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  Domo.DomoModel.findByOwner(req.session.account._id, (err2, domo) => {
    if (err2) {
      return res.status(400).json({ error: 'An error occured' });
    }

    if (!domo) {
      return res.status(400).json({ error: 'Domo does not exist' });
    }
    domo.age = req.body.age;
    domo.credit = req.body.credit;

    const domoPromise = domo.save();

    domoPromise.then(() => res.json({ redirect: '/maker' }));

    // Update Domo if it already exists
    domoPromise.catch((err) => res.status(400).json({ error: 'An error occured' }));
  });


    domo.save(function(err3, updatedDomo) {
      if (err3) {
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.send(updatedDomo);
    });

    return res.status(400).json({ error: 'An error occured' });

  });


  return res.status(400).json({ error: 'An error occured' });

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    credit: req.body.credit,
    owner: req.session.account._id,
  };


  // Update Domo
  Domo.DomoModel.findByOwner(req.session.account._id, (err2, doc) => {
    if (err2) {
      return res.status(400).json({ error: 'An error occured' });
    }


    // doc.age = req.body.age;
    // doc.credit = req.body.credit;
    doc.set({ age: req.body.age });
    doc.set({ credit: req.body.credit });
    doc.save((err3, updatedDomo) => {
      if (err3) {
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.send(updatedDomo);
    });

    return res.status(400).json({ error: 'An error occured' });
  });


  return res.status(400).json({ error: 'An error occured' });


  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));


  // Update Domo if it already exists
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      // return res.status(400).json({ error: 'Updated Domo' });
      console.log("ERRRRRRRRRRRRRRRRR");

    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;

};
*/

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
// module.exports.updateDomo = updateDomo;
