"use strict";

// eslint-disable-next-line node/no-unpublished-require
const request = require("request");
// eslint-disable-next-line node/no-unpublished-require
const expect = require("chai").expect;
const variables = require("./variables");

// eslint-disable-next-line jsdoc/require-jsdoc
function delay(seconds) {
    return it("should delay", done => {
        setTimeout(() => done(), (seconds * 1000));

    }).timeout((seconds * 1000) + 100);
}

describe("Getting the articles", () => {
    it("Articles are being sent", done => {
        request(variables.getArticlesSortedByDate, (error, response, body) => {
            expect(response).to.be.not.an("undefined");
            expect(response.statusCode).to.equal(200);
            expect(body.data).to.be.instanceOf(Array);
            done();
        });
    });
    // eslint-disable-next-line no-console
    console.log("The next tests are being run against the data. Waiting 60 seconds while the database is being fed");
    delay(60);
    it("Every article sources have a valid publication date", done => {
        request(variables.getArticlesSortedByDate, (error, response, body) => {
            expect(response).to.be.not.an("undefined");
            expect(response.statusCode).to.equal(200);

            for (let i = 0; i < body.data.length; i++) {
                expect(Date.parse(body.data[i].publicationDate)).to.be.a("number");
            }
            done();
        });
    });
    it("Every supported article sources are included in the response", done => {
        const articleSourceNameFound = [];

        request(variables.getArticlesSortedByDate, (error, response, body) => {
            expect(response).to.be.not.an("undefined");
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
            done();
        });
    });
    it("Every articles have a valid imageUrl field", done => {
        request(variables.getArticlesSortedByDate, (error, response, body) => {
            expect(response).to.be.not.an("undefined");
            expect(response.statusCode).to.equal(200);

            for (let i = 0; i < body.data.length; i++) {
                expect(body.data[i].imageUrl).to.be.not.an("undefined");
                expect(body.data[i].imageUrl.length).to.be.greaterThan(8);
            }
            done();
        });
    });
});
