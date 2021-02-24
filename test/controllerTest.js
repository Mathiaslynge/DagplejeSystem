require('should');
const controller = require("../controller/controller");

describe('controller test - promise', function () {

    it('createUgeOversigt test', async () => {
        let uger = await controller.createUgeoversigt(54);
        should.exist(uger);
        uger.ugenr.should.be.equal(54)
    });  

    it('createDag test', async () => {
        let dag = await controller.createDag("Sjov dag", "11:15", "12:15", "08:00", "09:00", false, false, "Det hygge");
        should.exist(dag);
        dag.Navn.should.be.equal("Sjov dag")
        dag.Hentes.should.be.equal("12:15")
        dag.Ferie.should.be.equal(false)
    });  
    it('getUgeoversigt test', async () => {
        let ugeoversigt = await controller.getUgeoversigt(54);
        should.exist(ugeoversigt);
        ugeoversigt.ugenr.should.be.equal(54)
    });  
    it('getUgeoversigter test', async () => {
        let ugeoversigter = await controller.getUgeoversigter();
        should.exist(ugeoversigter);
        ugeoversigter.length.should.be.greaterThanOrEqual(1);
        ugeoversigter[53].ugenr.should.be.equal(54)
    });
    it('createBruger test', async () => {
        let bruger = await controller.createBruger("Peter", "Madsen", 14, true, "Pande", "Sej", "imnotanowl", "imnotanowl1", true);
        should.exist(bruger);
        bruger.fornavn.should.be.equal("Peter")
        bruger.alder.should.be.equal('14')
        bruger.admin.should.be.equal(true)
    });  

    it('getBrugerFornavn test', async () => {
        let bruger = await controller.getBrugerFornavn("Peter");
        should.exist(bruger);
        bruger.fornavn.should.be.equal("Peter")
        bruger.alder.should.be.equal('14')
        bruger.admin.should.be.equal(true)
    }); 

    it('getDageMandagTilFredag test', async () => {
        let dage = await controller.getDageMandagTilFredag('5fc0dc11e6087806c454da99', '5fc0dcc1032de02e809a80c7');
        should.exist(dage);
        dage[0].Navn.should.be.equal("Mandag")
        dage[0].Syg.should.be.equal(false)
        dage[0].Kommentar.should.be.equal('Testen virker')
    });

    it('getBruger test', async () => {
        let bruger = await controller.getBruger("imnotanowl");
        should.exist(bruger);
        bruger.fornavn.should.be.equal("Morten")
        bruger.alder.should.be.equal('2020-12-03')
        bruger.admin.should.be.equal(false)
    });  



    it('getBoernene() test', async () => {
        let boernene = await controller.getBoernene();
        boernene.length.should.be.greaterThanOrEqual(1);
        boernene[0].username.should.be.equal('Frederik');
        boernene[1].username.should.be.equal('Frederik');

    });

    it('deleteBruger(brugerId) test', async () => {
        let bruger = null;
        bruger = await controller.getBruger('imnotanowl');
        console.log(bruger + "FØR SLETNING");
        await controller.deleteBruger(bruger._id)
        bruger = await controller.getBruger('imnotanowl');
        console.log(bruger + "EFTER SLETNING");
    });

    
    // it('connectDagTilUge test', async () => {
    //     let uge = await controller.getUgeoversigt(54);
    //     let bruger = await controller.getBruger('imnotanowl');
    //     const dag = await controller.createDag('Mandag', '12:15', '12:55', '10:10', '08:07', false, false, 'hej', uge, bruger);
    //     let connect = controller.connectDagTilUge(dag, uge);
    //     uge = await controller.getUgeoversigt(54);
    //     should.exist(connect);
    //     uge.dage[9].should.be.equal(dag._id);
    
    // });

    // it('connectDagTilBruger test', async () => {
    //     let bruger = null;
    //     bruger = await controller.getBruger('imnotanowl');
    //     console.log(bruger + "FØR SLETNING");
    //     await controller.deleteBruger(bruger._id)
    //     bruger = await controller.getBruger('imnotanowl');
    //     console.log(bruger + "EFTER SLETNING");
    // });



});

