const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');
const { eggplant } = require('../components/american-only.js');

suite('Functional Tests', () => {

  test('Translation with text and locale fields: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ 
        text: "eggplant",
        locale: "american-to-british"
       })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        console.log("res.body.text: " + res.body.text);
        console.log("res.body.translation: " + res.body.translation);
        assert.equal(res.body.text, "eggplant");
        assert.equal(res.body.translation, "aubergine");
      });
    done();
  });

  test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ 
        text: "eggplant",
        locale: "american-to-australian"
       })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value for locale field');
      });
    done();
  });

  test('Translation with missing text field: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ 
        locale: "american-to-british"
       })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
      });
    done();
  });

  test('Translation with missing locale field: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ 
        text: "eggplant"
       })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
      });
    done();
  });

  test('Translation with empty text: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ 
        text: "",
        locale: "american-to-british"
       })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'No text to translate');
      });
    done();
  });

   test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ 
        text: "",
        locale: "american-to-british"
       })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.translation, 'Everything looks good to me!');
      });
    done();
  }); 

});
