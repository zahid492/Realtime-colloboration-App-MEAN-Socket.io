var chakram = require('chakram');
var expect = chakram.expect;

describe("PATH API TEST", function () {
  it("should return an array (of paths)", function () {
    var response = chakram.get("http://localhost:8080/api/path");
    expect(response).to.have.status(200);
    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
    expect(response).not.to.be.encoded.with.gzip;
    expect(response).to.comprise.of.json([]);
    return chakram.wait();
  });
});