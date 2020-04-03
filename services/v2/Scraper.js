const axios = require('axios');
// url
const dohLocalCases = "https://services5.arcgis.com/mnYJ21GiFTR97WFg/ArcGIS/rest/services/PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=FID%20ASC";
const dohSummary = "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*";
const dohPerHospitalList = "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/conf_fac_tracking/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*";
const dohPerLocationList = "https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/municitycent/FeatureServer/0/query?f=json&where=count_%3E%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*";

class Scraper {

    async getLocalCases(url) {

        const result = {};
        await axios.get(url)
            .then((response) => {
                result.data = response.data.features;
            });

        return result;
    }

    async formatCases() {
        const res = await this.getLocalCases(dohLocalCases);
        const data = [];

        res.data.forEach((res) => {
            data.push(res.attributes.residence);
        });

        const result = {};
        let i = data.length;

        while (i--) {

            if (result.hasOwnProperty(data[i])) {
                result[data[i]]++;
                data.splice(i, 1);

            } else {
                result[data[i]] = 1;
            }
        }

        let formatted = [];

        formatted = Object.keys(result).sort().filter((p) => {
            if (p == 'CHINA' || p == 'For Verification' || p == 'For validation') {
                return false;
            }
            return true;
        }).map((p, key) => {
            return {
                id: key + 1,
                name: p.replace((["�"]), 'ñ'),
                count: result[p]
            };
        });
        return formatted;
    }

    async getSummary() {

        const res = await this.getLocalCases(dohSummary);

        const ts = new Date();

        const result = {
            'day': ts.toDateString(res.data[0].attributes.day),
            'confirmed': res.data[0].attributes.confirmed,
            'PUIs': res.data[0].attributes.PUIs,
            'PUMs': res.data[0].attributes.PUMs,
            'recovered': res.data[0].attributes.recovered,
            'deaths': res.data[0].attributes.deaths,
            'tests': res.data[0].attributes.tests,
        }
        
        return result;
    }

    async getLocationList() {

        const res = await this.getLocalCases(dohPerLocationList);

        const result =  [];

        res.data.forEach((res, index) => {

            const container = {};

            container.id = index + 1;
            container.region = res.attributes.ADM1_EN;
            container.province = res.attributes.ADM2_EN;
            container.city_mun = res.attributes.ADM3_EN;
            container.result = res.attributes.ADM3_EN + ', ' + res.attributes.ADM2_EN + ', ' + res.attributes.ADM1_EN;
            container.latitude = res.attributes.latitude;
            container.longitude = res.attributes.longitude;
            container.count = res.attributes.count_;
            result.push(container);

        });

        return result;
    }

    async getHospitalList() {

        const res = await this.getLocalCases(dohPerHospitalList);    

        const result = [];

        res.data.forEach((res, index) => {

            const container = {};

            container.id = index + 1;
            container.result = res.attributes.facility;
            container.latitude = res.attributes.latitude;
            container.longitude = res.attributes.longitude;
            container.count = res.attributes.count_;
            result.push(container);
        });

        return result;
    }

}

module.exports = Scraper;