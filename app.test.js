process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");

let nums = 'nums=1,2,3,3,4,5';
let noNums = 'nums=one,two,three,four';
let noMode = 'nums=1,2,3,4,5';
let manyNodes = 'nums=1,1,1,2,2,2,3,4';

describe("GET /mean", () => {
    test("Return a JSON object with the mean of several numbers", async () => {
        const response = await request(app).get(`/mean?${nums}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            response: {
                operation: "mean",
                value: 3
            }
        });
    });
    test("Return an error if the query does not include numbers", async () => {
        const response = await request(app).get(`/mean?${noNums}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("All values must be numbers");
    });
    test("Return an error if the query is empty", async () => {
        const response = await request(app).get('/mean?nums');
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("Numbers are required");
    });
});

describe("GET /median", () => {
    test("Return a JSON object with the median of seveal numbers", async () => {
        const response = await request(app).get(`/median?${nums}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            response: {
                operation: "median",
                value: 3
            }
        });
    });
    test("Rounds the value down for lists with no true middle", async () => {
        const response = await request(app).get('/median?nums=1,2,3,4');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            response: {
                operation: "median",
                value: 2
            }
        });
    });
    test("Return an error if the query does not include numbers", async () => {
        const response = await request(app).get(`/median?${noNums}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("All values must be numbers");
    });
    test("Returns an error if the query is empty", async () => {
        const response = await request(app).get(`/median?nums`);
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("Numbers are required");
    });
});

describe("GET /mode", () => {
    test("Return a JSON object with the mode of several numbers", async () => {
        const response = await request(app).get(`/mode?${nums}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            response: {
                operation: "mode",
                value: 3
            }
        });
    });
    test("Return a custom message if the numbers have no node or multiple nodes", async () => {
        const response = await request(app).get(`/mode?${noMode}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            response: {
                operation: "mode",
                error: "no single mode"
            }
        });
        const response2 = await request(app).get(`/mode?${manyNodes}`);
        expect(response2.statusCode).toBe(200);
        expect(response2.body).toEqual({
            response: {
                operation: "mode",
                error: "no single mode"
            }
        });
    });
    test("Return an error if the query does not include numbers", async () => {
        const response = await request(app).get(`/mode?${noNums}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("All values must be numbers");
    });
    test("Return an error if the query is empty", async () => {
        const response = await request(app).get('/mode?nums');
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("Numbers are required");
    });
});