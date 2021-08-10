const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  translate(text, locale, change) {
    // convert to array
    text = text.replace(/(^\s*)|(\s*$)/gi,""); //exclude  start and end white-space
    text = text.replace(/[ ]{2,}/gi," "); //2 or more spaces to 1
    text = text.replace(/\n /,"\n"); // exclude newline with a start spacing
    let textArray = text.split(' ');

    if (locale == "american-to-british") {
      for (let i = 0; i < textArray.length; i++) {
        // check for time elements
        if ( /^\d+:|.\d\d/.test(textArray[i]) ) {
          console.log(textArray[i]);
          textArray[i] = textArray[i].replace(/:/g, '.');
          console.log("British form: " + textArray[i]);
          change = true;
          continue;  // go back up for the next i
        };  

        // keep hyphenated or apostrophed words together, but separate punctuation
        let plainWord = textArray[i].match(/[\w-']+|\W+/g)[0]; 
        let punctuation = textArray[i].match(/[\w-']+|\W+/g)[1];
        console.log("plainWord: " + plainWord);

        Object.keys(americanToBritishTitles).forEach(title => {
          if (title == (plainWord + '.').toLowerCase() ) {
            textArray[i] = plainWord;
            console.log("British title:" + textArray[i]);
            change = true;
          }
        });

        Object.keys(americanOnly).forEach(word => {
          if (word == plainWord.toLowerCase()) {
            console.log("americanOnly.word:", americanOnly[word]);
            textArray[i] = americanOnly[word] + (punctuation ? punctuation : "");
            console.log("British word:" + textArray[i]);
            change = true;
          }
        });

        Object.keys(americanToBritishSpelling).forEach(word => {
          if (word == plainWord.toLowerCase()) {
            textArray[i] = americanToBritishSpelling[word] + (punctuation ? punctuation : "");
            console.log("British spelling: " + textArray[i]);
            change = true;
          }
        });

      }
    }

    if (locale == "british-to-american") {
      for (let i = 0; i < textArray.length; i++) {
        // check for time elements
        if ( /^\d+:|.\d\d/.test(textArray[i]) ) {
          console.log(textArray[i]);
          textArray[i] = textArray[i].replace(/./g, ':');
          console.log("American form: " + textArray[i]);
          change = true;
          continue;  // go back up for the next i
        };  

        // keep hyphenated or apostrophed words together, but separate punctuation
        let plainWord = textArray[i].match(/[\w-']+|\W+/g)[0]; 
        let punctuation = textArray[i].match(/[\w-']+|\W+/g)[1];
        console.log("plainWord:" + plainWord);

        Object.keys(americanToBritishTitles).forEach(title => {
          if (title == (plainWord + '.').toLowerCase() ) {
            textArray[i] = plainWord + '.';
            console.log("American title:" + textArray[i]);
            change = true;
          }
        });

        Object.keys(britishOnly).forEach(word => {
          if (word == plainWord.toLowerCase()) {
            textArray[i] = britishOnly[word] + (punctuation ? punctuation : "");
            console.log("American word:" + textArray[i]);
            change = true;
          }
        });

        Object.keys(americanToBritishSpelling).forEach(word => {
          if (americanToBritishSpelling[word] == plainWord.toLowerCase()) {
            textArray[i] = word + (punctuation ? punctuation : "");
            console.log("American spelling:" + textArray[i]);
            change = true;
          }
        });

      }
    }

    let translation = textArray.join(" ");
    console.log("translator.js translation: " + translation);
    return {translation, change};
  }


  

}

module.exports = Translator;