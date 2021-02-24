require('should');
const { assert } = require('console');
const request = require('supertest');
const controller = require("../controller/controller"); // den klasse vi vil teste på

describe("Login test", () => {
    it("login true", async () => {
    let bruger = await controller.createBruger('Peter', 'Petersen', 5, true, 'Lise Lotte', 'Jens Ole', 'Bruger', 'Bruger', false);
    let auth = await controller.brugerVerificiering(bruger.username, 'Bruger');
    auth.should.be.true;
    });

    it("login false", async () => {
      let bruger = await controller.createBruger('Peter', 'Petersen', 5, true, 'Lise Lotte', 'Jens Ole', 'Bruger', 'Bruger', false);
      let auth = await controller.brugerVerificiering(bruger.username, 'bruger');
      auth.should.be.false;
      
      });
  });

  describe("Administrator eller bruger test", () => {

    it("Er admin", async () => {
    let admin = await controller.createBruger('Admin', 'Jensen', 55, true, null, null, 'Admin', 'Admin', true); 
   
    admin.adminOrUser.should.be.true;
     
    });

    it("Er bruger", async () => {
      let bruger = await controller.createBruger('Peter', 'Petersen', 5, true, 'Lise Lotte', 'Jens Ole', 'Bruger', 'Bruger', false);
  
      bruger.adminOrUser.should.be.false;
  
      });
  });
