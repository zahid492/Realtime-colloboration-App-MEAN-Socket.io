var chakram = require('chakram');
var expect = chakram.expect;

describe("SITE API TEST", function () {
  it("should return an array (of sites)", function () {
    var response = chakram.get("http://localhost:8080/api/sites");
    expect(response).to.have.status(403);
    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
    expect(response).not.to.be.encoded.with.gzip;
    expect(response).to.comprise.of.json([]);
    return chakram.wait();
  });
});