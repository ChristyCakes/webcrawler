var request = require('request');
var cheerio = require('cheerio');

var SEARCH_WORDS = ["James Horner", "Jerry Goldsmith"];
var MAX_PAGES_TO_VISIT = 8000;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var data = []

preCrawl("https://www.soundtracks.com", continuePreCrawl);

function preCrawl(url, callback) {
    console.log("Searching for composers ...")
    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            let $ = cheerio.load(html)
            searchForComposers($);
            callback()
        } else {
            console.log("There was a request or statusCode error.")
        }
    });
}

function continuePreCrawl() {
    for (count = 2; count < 100; count++) {
        request(`https://www.soundtracks.com/page/${count}/`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html)
                searchForComposers($);
            } else {
                console.log("There was a request or statusCode error.")
            }
        })
    }
    count++
    console.log(
        `Reached end of first crawl.
        Retrieving data ...`)
    crawl();
}

function searchForComposers($) {
    $('div.cb-story b').each(function () {
        if (($(this).text() == "Composers") && (SEARCH_WORDS.includes($(this).next().text()))) {
            let parent = $(this).closest('.cb-box')
            let accesslink = parent.find('.full-link a').attr('href')
            pagesToVisit.push(accesslink)
        }
    })
}

function crawl() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        crawl();
    } else {
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    if (url == undefined) {
        console.log(data)
        return console.log("Reached the end of the search")
    }
    pagesVisited[url] = true;
    numPagesVisited++;
    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            let $ = cheerio.load(html)
            searchForWords($);
            callback()
        } else {
            console.log("There was a request or statusCode error.")
            callback()
        }
    });
}

function searchForWords($) {
    $('div.cb-story b').each(function () {
        if ($(this).text() == "Composer") {
            console.log(`Retrieving soundtrack by ${$(this).next().text()}`)
            data.push(
                `Composer: ${$(this).next().text()}`
            )
        }
    })

    let title = $('#news-title').text()
    data.push(
        `Title: ${title}`
    )

    let downloadlink = $('span.imp').prev().attr('href')
    data.push(`download link: ${downloadlink}`)
}