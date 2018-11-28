// crawler first steps from https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping
// other code from http://www.netinstructions.com/how-to-make-a-simple-web-crawler-in-javascript-and-node-js/ 

var request = require('request');
var cheerio = require('cheerio');

let composersiwant = ["James Horner", "Inon Zur"]
let accesslinks = []

request('https://www.soundtracks.com/', (error, response, html) => {
  if (error) {
    console.log("error on initial page request: ", error)
  }

  if (!error && response.statusCode == 200) {

    // set var for loaded html
    var $ = cheerio.load(html);

    // loop through each b element in the cb-box div
    $('div.cb-box b').each(function () {

      // set variables
      let blabel = $(this).text();
      let composername = $(this).next().text();

      // if the composer matches a name in our array ...
      if ((blabel == 'Composers') && (composersiwant.includes(composername))) {

        // traverse up to parent of both composer tag and download link tag
        let parent = $(this).closest('.cb-box');

        // traverse down to download link anchor
        let access = parent.find('.full-link a').attr('href')

        // add link to array
        accesslinks.push(access)
      }
    })
  }
})