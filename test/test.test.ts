//header set case
//check for the create account
//
import {createtransfer, createtransferSchema } from '../src/controllers/file'
import request from "supertest";
import app from "../src/app";
import '@types/jest'
import { randomUUID } from 'node:crypto';
// import { deleteFile } from "./helper";
// beforeEach(async () => {
//   deleteFile();
// });
describe("GET ACCOUNT TESTS", () => {
  test("gets no balance if database.json file does not exist", async () => {
    const res = await request(app).get("/balance");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
  test("gets single account if there are acounts in the database.json file", async () => {
    const req = await request(app).get("'/balance/:accountNumber'");
    const validTransferData = createtransferSchema.parse(req.body);
    const db = {
       ...validTransferData,
      reference: randomUUID(),
      createdAt: new Date(), };
    await request(app).post("/createAccount").send(db);
    const res = await request(app).get("/api/todos");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([db]);
  });
});
describe("POST API TESTS", () => {
  test("it creates todos", async () => {
    const sampleTodo = { title: "test", content: "my very first todo" };
    const res = await request(app).post("/api/todos").send(sampleTodo);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: "Todo Created Successfully" });
  });
});

//the status code
//response type
//

// chai.use(chaiHttp);

// describe('Books', () => {
//     beforeEach((done) => {
//         Book.remove({}, (err) => {
//            done();
//         });
//     });
  // describe('/GET book', () => {
  //     it('it should GET all the books', (done) => {
  //           chai.request(server)
  //           .get('/book')
  //           .end((err, res) => {
  //                 res.should.have.status(200);
  //                 res.body.should.be.a('array');
  //                 res.body.length.should.be.eql(0);
  //             done();
  //           });
  //     });
  // });
