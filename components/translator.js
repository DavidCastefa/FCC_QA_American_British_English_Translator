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
          textArray[i] = textArray[i].replace(/:/, '.');
          textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
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
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            console.log("British title:" + textArray[i]);
            change = true;
          }
        });

        Object.keys(americanOnly).forEach(word => {
          // check for single-word expressions
          if (word == plainWord.toLowerCase()) {
            console.log("americanOnly[word]:", americanOnly[word]);
            textArray[i] = americanOnly[word]
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (punctuation ? punctuation : "");
            console.log("British word:" + textArray[i]);

            change = true;
          }
          // if it's the final word in text, exit the forEach loop
          if (i == textArray.length -1 ) return;

          // if not, check for double-word expressions
          let nextPlainWord = textArray[i+1].match(/[\w-']+|\W+/g)[0];
          let nextPunctuation = textArray[i+1].match(/[\w-']+|\W+/g)[1];
          if (word == plainWord.toLowerCase() + ' ' + nextPlainWord.toLowerCase() ) {
            console.log("americanOnly[word]:", americanOnly[word]);
            textArray[i] = americanOnly[word]
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (punctuation ? punctuation : "");
            console.log("British word:" + textArray[i]);
            change = true;
            // Since we've already translated the next word, we need to delete it
            textArray.splice(i+1, 1);
          }
          // if this is now the final word, exit the forEach loop
          if (i == textArray.length -2 ) return;

          // if not, check for triple-word expressions
          let thirdPlainWord = textArray[i+2].match(/[\w-']+|\W+/g)[0];
          let thirdPunctuation = textArray[i+2].match(/[\w-']+|\W+/g)[1];
          if (word == plainWord.toLowerCase() + ' ' +
               nextPlainWord.toLowerCase() + ' ' + 
               thirdPlainWord.toLowerCase()  ) {
            console.log("americanOnly[word]:", americanOnly[word]);
            textArray[i] = americanOnly[word]
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (punctuation ? punctuation : "");
            console.log("British word:" + textArray[i]);
            change = true;
            // Since we've already translated the third word, we need to delete it also
            textArray.splice(i+1, 2);
          }
        });

        Object.keys(americanToBritishSpelling).forEach(word => {
          if (word == plainWord.toLowerCase()) {
            textArray[i] = americanToBritishSpelling[word];
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (punctuation ? punctuation : "");
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
          textArray[i] = textArray[i].replace(/\./, ':');
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
          // check for single-word expressions
          if (word == plainWord.toLowerCase()) {
            textArray[i] = britishOnly[word] + (punctuation ? punctuation : "");
            console.log("American word:" + textArray[i]);
            change = true;
          }
          // if it's the final word in text, exit the forEach loop
          if (!textArray[i+1]) return;

          // if not, check for double-word expressions
          let nextPlainWord = textArray[i+1].match(/[\w-']+|\W+/g)[0];
          let nextPunctuation = textArray[i+1].match(/[\w-']+|\W+/g)[1];
          if (word == plainWord.toLowerCase() + ' ' + nextPlainWord.toLowerCase() ) {
            console.log("britishOnly.word:", britishOnly[word]);
            textArray[i] = britishOnly[word] + (nextPunctuation ? nextPunctuation : "");
            console.log("British word:" + textArray[i]);
            change = true;
            // Since we've already translated the next word, we need to delete it
            textArray.splice(i+1, 1);
            console.log(textArray);
            console.log("i, textArray.length:", i, textArray.length);
            console.log("i, textArray.length:", i, textArray.length);
          }
          // if this is now the final word, exit the forEach loop
          if (!textArray[i+2]) return;

          // if not, check for triple-word expressions
          let thirdPlainWord = textArray[i+2].match(/[\w-']+|\W+/g)[0];
          let thirdPunctuation = textArray[i+2].match(/[\w-']+|\W+/g)[1];
          if (word == plainWord.toLowerCase() + ' ' +
                nextPlainWord.toLowerCase() + ' ' + 
                thirdPlainWord.toLowerCase()  ) {
            console.log("britishOnly.word:", britishOnly[word]);
            textArray[i] = britishOnly[word] + (thirdPunctuation ? thirdPunctuation : "");
            console.log("British word:" + textArray[i]);
            change = true;
            // Since we've already translated the third word, we need to delete it also
            textArray.splice(i+1, 2);
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