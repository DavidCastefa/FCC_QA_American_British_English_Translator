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
          textArray[i] = textArray[i].replace(/:/, '.');
          textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
          change = true;
          continue;  // go back up for the next i
        };  

        // keep hyphenated or apostrophed words together, but separate punctuation
        let plainWord = textArray[i].match(/[\w-']+|\W+/g)[0]; 
        let punctuation = textArray[i].match(/[\w-']+|\W+/g)[1];

        Object.keys(americanToBritishTitles).forEach(title => {
          if (title == (plainWord + '.').toLowerCase() ) { 
            textArray[i] = plainWord;
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            change = true;
          }
        });

        Object.keys(americanOnly).forEach(word => {
          // check for single-word expressions
          if (word == plainWord.toLowerCase()) {
            textArray[i] = americanOnly[word]
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (punctuation ? punctuation : "");
            change = true;
          }
          // if it's the final word in text, exit the forEach loop
          if (i == textArray.length -1 ) return;

          // if not, check for double-word expressions
          let nextPlainWord = textArray[i+1].match(/[\w-']+|\W+/g)[0];
          let nextPunctuation = textArray[i+1].match(/[\w-']+|\W+/g)[1];
          if (word == plainWord.toLowerCase() + ' ' + nextPlainWord.toLowerCase() ) {
            textArray[i] = americanOnly[word];
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (nextPunctuation ? nextPunctuation : "");
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
            textArray[i] = americanOnly[word];
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (thirdPunctuation ? thirdPunctuation : "");
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
            change = true;
          }
        });

      }
    }

    if (locale == "british-to-american") {
      for (let i = 0; i < textArray.length; i++) {
        // check for time elements
        if ( /^\d+:|.\d\d/.test(textArray[i]) ) {
          textArray[i] = textArray[i].replace(/\./, ':');
          textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
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
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            change = true;
          }
        });

        Object.keys(britishOnly).forEach(word => {
          // check for single-word expressions
          if (word == plainWord.toLowerCase()) {
            textArray[i] = britishOnly[word];
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (punctuation ? punctuation : "");
            change = true;
          }
          // if it's the final word in text, exit the forEach loop
          if (!textArray[i+1]) return;

          // if not, check for double-word expressions
          let nextPlainWord = textArray[i+1].match(/[\w-']+|\W+/g)[0];
          let nextPunctuation = textArray[i+1].match(/[\w-']+|\W+/g)[1];
          if (word == plainWord.toLowerCase() + ' ' + nextPlainWord.toLowerCase() ) {
            textArray[i] = britishOnly[word];
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (nextPunctuation ? nextPunctuation : "");
            change = true;
            // Since we've already translated the next word, we need to delete it
            textArray.splice(i+1, 1);
          }
          // if this is now the final word, exit the forEach loop
          if (!textArray[i+2]) return;

          // if not, check for triple-word expressions
          let thirdPlainWord = textArray[i+2].match(/[\w-']+|\W+/g)[0];
          let thirdPunctuation = textArray[i+2].match(/[\w-']+|\W+/g)[1];
          if (word == plainWord.toLowerCase() + ' ' +
                nextPlainWord.toLowerCase() + ' ' + 
                thirdPlainWord.toLowerCase()  ) {
            textArray[i] = britishOnly[word];
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (thirdPunctuation ? thirdPunctuation : "");
            change = true;
            // Since we've already translated the third word, we need to delete it also
            textArray.splice(i+1, 2);
          }
        });

        Object.keys(americanToBritishSpelling).forEach(word => {
          if (americanToBritishSpelling[word] == plainWord.toLowerCase()) {
            textArray[i] = word;
            textArray[i] = '<span class="highlight">' + textArray[i] + '</span>';
            textArray[i] = textArray[i] + (punctuation ? punctuation : "");
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