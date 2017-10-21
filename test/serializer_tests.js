"use strict";

import { expect } from "chai";

import JSONSerializer from "../src/serializer";
import fixtures from "./fixtures";

describe("JSONSerializer", function () {
  let serializer, user;

  beforeEach(function () {
    serializer = new JSONSerializer();

    return fixtures.sequelize.sync({ force: true }).then(() =>
      fixtures.UserModel.create({
        firstName: "John"
      }).then(john => { user = john; })
    );
  });

  describe("#normalizeResponse", function () {
    it("formats a model instance for a findAll request", function () {
      return serializer.normalizeResponse([user], "findAll").then(response => {
        expect(response[0].firstName).to.eql("John");
      });
    });

    it("formats a model instance for a findAll request with no records", function () {
      return serializer.normalizeResponse([], "findAll", "user").then(response => {
        expect(response).to.eql([]);
      });
    });

    it("formats a model instance for a findOne request", function () {
      return serializer.normalizeResponse(user, "findOne").then(response => {
        expect(response.firstName).to.eql("John");
      });
    });

    it("formats a model instance for a queryRecord request", function () {
      return serializer.normalizeResponse(user, "queryRecord").then(response => {
        expect(response.firstName).to.eql("John");
      });
    });

    it("formats a model instance for a createRecord request", function () {
      return serializer.normalizeResponse(user, "createRecord").then(response => {
        expect(response.firstName).to.eql("John");
      });
    });

    it("formats a model instance for an updateRecord request", function () {
      return serializer.normalizeResponse(user, "updateRecord").then(response => {
        expect(response.firstName).to.eql("John");
      });
    });

    it("formats singular response by default", function () {
      return serializer.normalizeResponse(user).then(response => {
        expect(response.firstName).to.eql("John");
      });
    });
  });
});
