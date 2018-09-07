const chai = require("chai");
const expect = chai.expect;
// import sinon
const sinon = require("sinon");
const rosterController = require("./roster.controller.js");

describe("generate", function() {
  it("should return json object with starters field with an array of length 10 and substitues field with an array of length 5", function() {
    let req = { query : {} }
    // Have `res` have a send key with a function value coz we use `res.send()` in our func
    let res = {
      json: sinon.spy()
    }

    rosterController.generate(req, res);
    // let's see what we get on res.send
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0].starters.length).to.equal(10);
    expect(res.json.firstCall.args[0].substitutes.length).to.equal(5);
    //console.log(res.json.firstCall.args[0]);
  });
});

describe("generate", function() {
  it("should return json with first starter in the starters array having a name of Paul Pierce", function() {
    let req = { query : { teamName:"Boston Celtics", minRating:3, extraPoints:15 } }
    // Have `res` have a send key with a function value coz we use `res.send()` in our func
    let res = {
      json: sinon.spy()
    }

    rosterController.generate(req, res);
    // let's see what we get on res.send
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0].starters[0].name).to.equal("Paul Pierce");
    //console.log(res.json.firstCall.args[0]);
  });
});

describe("generate", function() {
  it("should return json with first starter in the starters array having a name of Tom Brady", function() {
    let req = { query : { teamName:"New England Patriots", minRating:3, extraPoints:17 } }
    // Have `res` have a send key with a function value coz we use `res.send()` in our func
    let res = {
      json: sinon.spy()
    }

    rosterController.generate(req, res);
    // let's see what we get on res.send
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0].starters[0].name).to.equal("Tom Brady");
    //console.log(res.json.firstCall.args[0]);
  });
});
