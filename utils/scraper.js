const path = require('path');
const Nightmare = require('nightmare');


module.exports.scrapeOFAC = (searchObj) => {
  const nightmare = Nightmare({ 
    show: false,
    paths: {
      userData: '/user/data'
    },
    downloads: __dirname,

    waitTimeout: 1000*60*2
  })
  return nightmare
  .goto('https://sanctionssearch.ofac.treas.gov/')
  .type('input[name="ctl00$MainContent$txtLastName"]', searchObj.name)
  .type('input[name="ctl00$MainContent$Slider1_Boundcontrol"]', '')
  .type('input[name="ctl00$MainContent$Slider1_Boundcontrol"]', searchObj.minimumScore)
  .click('input[name="ctl00$MainContent$btnSearch"]')
  .wait('#gvSearchResults')
  .wait(1000 * 5)
  .evaluate(() => {
    let rows = document.querySelectorAll('#gvSearchResults tr');
    let result = [];
    for (let i = 0; i < rows.length; i ++) {
      try {
        let obj = {};
        let tds = rows[i].querySelectorAll('td');
        obj.name = tds[0].querySelector('a').innerHTML;
        let link = tds[0].querySelector('a').href;
        let match = link.match(/id\=(\d+)"/);
        obj.link = match ? ('https://sanctionssearch.ofac.treas.gov/Details.aspx?id=' + match[1]) : 'https://sanctionssearch.ofac.treas.gov/';
        
        obj.address = tds[1].innerHTML;
        obj.type = tds[2].innerHTML;
        obj.program = tds[3].innerHTML;
        obj.list = tds[4].innerHTML;
        obj.score = tds[5].innerHTML;
        result.push(obj);
      } catch(err) {
        console.log(err);
      }
    }
    return result;
  })
  .end()
  .then((res)=>{
    console.log(res);
    return res;
  })
  .catch(error => {
    console.error('Search failed:', error)
    return [];
  })
}