require('should');
const request = require('supertest');
const controller = require("../controller/controller");
const app = require('../app.js');

describe('integration test - promise', function () {

    it("get('/bruger/Joachim') test", async () => {
        let response = await request(app)
            .get('/bruger/Joachim')
            .expect(200)
            .expect('Content-Type', /json/);
        response.body.efternavn.should.be.equal('Joachimsen');
    });
    

    it("post('/ugeoversigt/Updates') test", async () => {
        let response = await request(app)
            .post('/ugeoversigt/updates')
            .send({
                    'dag': 'Mandag',
                    'afleveres': '12:15',
                    'hentes': '12:55',
                    'sovetFra': '10:10',
                    'sovetTil': '12:10',
                    'syg': false,
                    'ferie': false,
                    'kommentar': 'Testen virker',
                    'ugeoversigt': '5fc0dc11e6087806c454da99',
                    'barnet': '5fc0dcc1032de02e809a80c7'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200);
        response.body.message.should.be.equal('ugeoversight saved!');
        //console.log(response.body.sovetTil + "Det her kommer tilbage")
        //response.body.sovetTil.should.be.equal('12:10');
        
    });

});