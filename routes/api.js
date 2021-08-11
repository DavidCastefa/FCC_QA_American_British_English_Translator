'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      // first check for errors
      if (req.body.text == "") return res.json({ error: 'No text to translate' });
      if (!req.body.text || !req.body.locale) {
        return res.json({ error: 'Required field(s) missing' });
      }
      if (req.body.locale != "american-to-british" && req.body.locale != "british-to-american") {
        return res.json({ error: 'Invalid value for locale field' });
      }
      // then process the request
      let change = false;
      let translation = translator.translate(req.body.text, req.body.locale, change);
      console.log("translation.translation: " + translation.translation);
      console.log("translation.change: " + translation.change);
      if (translation.change == false) res.json({
        text: req.body.text,
        translation: 'Everything looks good to me!'
      });
      return res.json({
        text: req.body.text,
        translation: translation.translation 
      });
    });
};
