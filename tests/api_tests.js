"use strict";

// eslint-disable-next-line node/no-unpublished-require
const request = require("request");
// eslint-disable-next-line node/no-unpublished-require
const expect = require("chai").expect;
const variables = require("./variables");

describe("Getting the articles", () => {
    it("Articles are being sent", done => {
        request(variables.getArticlesSortedByDate, (error, response, body) => {
            if (!error) {
                expect(response.statusCode).to.equal(200);
                expect(body.data).to.be.instanceOf(Array);
            }
            // eslint-disable-next-line no-unused-expressions
            expect(error).to.be.null;
            done();
        });
    });
    it("Every supported article sources are included in the response", done => {
        const articleSourceNameFound = [];

        request(variables.getArticlesSortedByDate, (error, response, body) => {
            if (!error) {
                expect(response.statusCode).to.equal(200);

                for (let i = 0;
                    i < body.data.length &&
                    variables.articleSourcesName.length !== articleSourceNameFound.length;
                    i++) {
                    if (!articleSourceNameFound.includes(body.data[i].articleSource.name)) {
                        articleSourceNameFound.push(body.data[i].articleSource.name);
                    }
                }
                expect(articleSourceNameFound.length).to.equal(variables.articleSourcesName.length);
            }
            // eslint-disable-next-line no-unused-expressions
            expect(error).to.be.null;
            done();
        });
    });
    it("Every article sources have a valid publication date", done => {
        request(variables.getArticlesSortedByDate, (error, response, body) => {
            if (!error) {
                expect(response.statusCode).to.equal(200);

                for (let i = 0; i < body.data.length; i++) {
                    expect(Date.parse(body.data[i].publicationDate)).to.be.a("number");
                }
            }
            // eslint-disable-next-line no-unused-expressions
            expect(error).to.be.null;
            done();
        });
    });
});
