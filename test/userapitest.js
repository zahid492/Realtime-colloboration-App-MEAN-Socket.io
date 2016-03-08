var chakram = require('chakram');
var expect = chakram.expect;

describe("User API TEST", function () {
  it("should return an array (of users)", function () {
    var response = chakram.get("http://localhost:8080/api/user");
    expect(response).to.have.status(200);
    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
    expect(response).not.to.be.encoded.with.gzip;
    expect(response).to.comprise.of.json([]);
    return chakram.wait();
  });
});