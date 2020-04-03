const axios = require('axios');
const cheerio = require('cheerio');
const cheerioTableParser = require('cheerio-tableparser');

// urls
const worldometer = "https://www.worldometers.info/coronavirus/country/philippines/";
const wiki = "https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_Philippines";

class Scraper {
   
  async getData(url) {
    try {
      const response = await axios.get(url)

      if (response.status !== 200) {
        console.log("link broken");
      }
      
      return cheerio.load(response.data);

    } catch (err) {
      return null;
    }
  }
  
  async getSummary() {

    const $ = await this.getData(worldometer, false);

    const result = {};

    $(".maincounter-number").filter((i, el) => {
      let count = el.children[0].next.children[0].data || "0";
      count = parseInt(count.replace(/,/g, "") || "0", 10);
      if (i === 0) {
        result.confirmed_cases = count;
      } else if (i === 1) {
        result.deaths = count;
      } else {
        result.recovered = count;
      }
    });

    result.active = parseInt($(".number-table-main").first().text());

    return result;
  }

  async getCase() {

    const $ = await this.getData(wiki);

    cheerioTableParser($);

    const container = [];

    let result = {};

    const data = $('.wikitable').eq(0).parsetable(true, true, true);

    const len = data[0].length;

    let i;

    for (i = 0; i < len; i++) {

      if (i === 0) {
        continue;
      }

      result = {
        case_no: data[0][i],
        date: data[1][i],
        age: data[2][i],
        gender: data[3][i],
        nationality: data[4][i],
        facility: data[5][i],
        travel_history: data[6][i],
        status: data[7][i],
        notes: data[8][i],
      };

      container.push(result);
    }

    return container;
  }

  async getCaseOutside() {

    const $ = await this.getData(wiki, false);

    cheerioTableParser($);

    const container = [];

    let result = {};

    const data = $('.wikitable').eq(1).parsetable(true, true, true);

    // -3 to exclude other irrelevant info
    const len = data[0].length - 3;

    let i;

    for (i = 0; i < len; i++) {
      if (i === 0) {
        continue;
      }

      result = {
        country_terrirory_places: data[0][i],
        confirmed: data[1][i],
        recovered: data[2][i],
        died: data[3][i]
      };

      container.push(result);
    }
    return container;
  }

}

module.exports = Scraper;