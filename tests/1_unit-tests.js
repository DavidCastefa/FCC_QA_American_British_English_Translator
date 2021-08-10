const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Unit Tests', () => {

  suite('10 American to British tests ', () => {

    test('Translate "Mangoes are my favorite fruit." to British English', (done) => {
      let text = "Mangoes are my favorite fruit.";
      let locale = "american-to-british"
      let change = false 
      let goodTranslation = "Mangoes are my favourite fruit.";
      let testResult = translator.translate(text, locale, change).translation;
      console.log("testResult:", testResult);
      assert.equal(testResult, goodTranslation);
      done();
    });

  });

  suite('10 British to American tests ', () => {

    
  });


  suite('4 highlighting tests ', () => {

    
  });


});
