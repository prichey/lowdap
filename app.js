const express = require('express');
const app = express();

const _ = require('lodash');

app.get('/', (req, res) => {
  res.redirect('https://github.com/prichey/lowdap');
});

app.get('/:fn/:params', (req, res) => {
  try {
    console.log(req.params);

    if (_.has(req.params, 'fn') && _.has(req.params, 'params')) {
      const fn = req.params.fn;

      if (_.has(_, fn)) {
        if (_.isString(req.params.params)) {
          const param = req.params.params;
          const result = _[fn](param);
          res.status(200).send(result);
        } else if (_.isArray(req.params.params)) {
          const params = req.params.params;
          const result = _[fn](...params);
          res.status(200).send(result);
        } else {
          res.status(500).send({ error: 'param must be a string or an array' });
        }
      } else {
        res.status(500).send({ error: 'invalid lodash function' });
      }
    } else {
      res
        .status(500)
        .send({ error: 'improper request. should be GET /fn/params' });
    }
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.use('*', (req, res) => {
  res.sendStatus(500);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
