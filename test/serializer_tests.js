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
        expect(response.users[0].firstName).to.eql("John");
      });
    });

    it("formats a model instance for a findAll request with no records", function () {
      return serializer.normalizeResponse([], "findAll", "user").then(response => {
        expect(response.users).to.eql([]);
      });
    });

    it("formats a model instance for a findOne request", function () {
      return serializer.normalizeResponse(user, "findOne").then(response => {
        expect(response.user.firstName).to.eql("John");
      });
    });

    it("formats a model instance for a queryRecord request", function () {
      return serializer.normalizeResponse(user, "queryRecord").then(response => {
        expect(response.user.firstName).to.eql("John");
      });
    });

    it("formats a model instance for a createRecord request", function () {
      return serializer.normalizeResponse(user, "createRecord").then(response => {
        expect(response.user.firstName).to.eql("John");
      });
    });

    it("formats a model instance for an updateRecord request", function () {
      return serializer.normalizeResponse(user, "updateRecord").then(response => {
        expect(response.user.firstName).to.eql("John");
      });
    });

    describe("relationships", function () {
      let group, parent, project;

      beforeEach(function () {
        return Promise.all([
          fixtures.GroupModel.create({ name: "awesomeness" }),
          fixtures.ProjectModel.create({ name: "test" }),
          fixtures.UserModel.create({ firstName: "jane" })
        ]).then(response => {
          const awesomeness = response[0];
          const test = response[1];
          const jane = response[2];

          group = awesomeness;
          parent = jane;
          project = test;

          return Promise.all([
            user.setParent(parent),
            user.setGroups([group]),
            user.setProjects([project])
          ]);
        });
      });

      it("includes relationships for a findAll request", function () {
        return serializer.normalizeResponse([user], "findAll").then(response => {
          expect(response.users[0].projects[0]).to.eql(project.id);
        });
      });

      it("includes relationships for a findOne request", function () {
        return serializer.normalizeResponse(user, "findOne").then(response => {
          expect(response.user.projects[0]).to.eql(project.id);
        });
      });
    });
  });

  describe("#normalizeRelationships", function () {
    let group, parent, project;

    beforeEach(function () {
      return Promise.all([
        fixtures.GroupModel.create({ name: "awesomeness" }),
        fixtures.ProjectModel.create({ name: "test" }),
        fixtures.UserModel.create({ firstName: "jane" })
      ]).then(response => {
        const awesomeness = response[0];
        const test = response[1];
        const jane = response[2];

        group = awesomeness;
        parent = jane;
        project = test;

        return Promise.all([
          user.setParent(parent),
          user.setGroups([group]),
          user.setProjects([project])
        ]);
      });
    });

    it("formats hasMany/belongsToMany relationships", function () {
      const associations = user.Model.associations;

      return serializer
        .normalizeRelationships(user, user.toJSON())
        .then(res => {
          expect(res.projects[0]).to.eql(project.id);
        });
    });

    it("returns an empty array if no records are found", function () {
      const associations = user.Model.associations;

      return user.setProjects([])
        .then(() => serializer.normalizeRelationships(user, user.toJSON()))
        .then(res => {
          expect(res.projects).to.eql([]);
        });
    });
  });
});
