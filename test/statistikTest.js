require('should');
const request = require('supertest');
const app = require('../app.js')
const controller = require("../controller/controller");


describe('statistik test - promise', function () {
    it("get('/statistik.html')", async () => {
        let response = await request(app)
        .get('/statistik.html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8')
    })

    it("antal sygedage", async () => {
        let res1 = await controller.antalSygedage(1, 2, '5fc6784aa48715a324917d62')
        let res2 = await controller.antalSygedage(1, 2, '5fc672d0a48715a324917c5d')
        res1.should.be.equal(0)
        res2.should.be.equal(3)
        res1.should.not.be.equal(null)
        res2.should.not.be.equal(null)
    })

    it("ferieoversigt", async () => {
        let res = await controller.ferieoversigtAlleBørn(1)
        let res2 = await controller.ferieoversigtAlleBørn(2)
        res.should.be.equal(5)
        res2.should.be.equal(0)
        res2.should.not.be.equal(null)
    })

    it("gennemsnit søvn", async () => {
        let res1 = await controller.gennemsnitligSøvnPrDag(1, 1, '5fc672d0a48715a324917c5d')
        let res2 = await controller.gennemsnitligSøvnPrDag(1, 2, '5fc672d0a48715a324917c5d')
        res1[0].should.be.equal(1)
        res1[1].should.be.equal(57)
        res2[0].should.be.equal(0)
        res2[1].should.be.equal(51.42857142857142)
        res2[0].should.not.be.equal(null)
    })

    it("gennemsnit tilstedeværelse", async () => {
        let res1 = await controller.gennemsnitligUgentligTilstedeværelse(1, 2, '5fc672d0a48715a324917c5d')
        let res2 = await controller.gennemsnitligUgentligTilstedeværelse(1, 2, '5fc6784aa48715a324917d62')
        res1[0].should.be.equal(15)
        res1[1].should.be.equal(30)
        res2[0].should.be.equal(12)
        res2[1].should.be.equal(30)
    })
})