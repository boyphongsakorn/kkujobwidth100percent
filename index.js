//node-fetch and cheerio are required to run this script
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');
const express = require('express');

//set up express
const app = express();

//set up port
const port = process.env.PORT || 3000;

//set up routes
app.get('/', (req, res) => {
    //fetch https://personweb.kku.ac.th/e-administration/FrontEnd/Jobs/JoblistTH.php and parse the html by cheerio
    fetch('https://personweb.kku.ac.th/e-administration/FrontEnd/Jobs/JoblistTH.php')
    .then(res => res.text())
    .then(body => {
        //change every ../../ to https://personweb.kku.ac.th/e-administration/
        body = body.replace(/\.\.\/\.\.\//g, 'https://personweb.kku.ac.th/e-administration/'); 

        //load the html body into cheerio
        const $ = cheerio.load(body);

        //change width of the table to 100%
        $('table').attr('width', '100%');

        //change width of the image 10th,11th,12th,13th to 100%
        $('img').each((i, elem) => {
            if(i >= 10 && i <= 13) {
                $(elem).attr('width', '100%');
            }
        });

        //get every src of img tag
        //const imgSrcs = $('img').map((i, el) => $(el).attr('src')).get();
        //console.log(imgSrcs);

        //response html by sending the html body
        res.send($.html());
    });
});

//set up the server
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});