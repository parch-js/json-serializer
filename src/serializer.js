"use strict";

export default class JSONSerializer {
  async normalizeArrayResponse(instances) {
    const records = [];

    for (const instance of instances) {
      const json = instance.toJSON();

      await this.normalizeRelationships(instance, json);

      records.push(json);
    }

    return records;
  }

  normalizeRelationships(instance, payload) { return payload; }

  normalizeResponse(instance, method, fallbackName) {
    switch (method) {
      case "createRecord":
      case "findOne":
      case "queryRecord":
      case "updateRecord":
        return this.normalizeSingularResponse(instance, fallbackName);
      case "findAll":
        return this.normalizeArrayResponse(instance, fallbackName);
    }
  }

  async normalizeSingularResponse(instance) {
    const json = instance.toJSON();

    await this.normalizeRelationships(instance, json);

    return json;
  }
}
