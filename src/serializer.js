"use strict";

export default class JSONSerializer {
  normalizeArrayResponse(instances) {
    return Promise.resolve(instances);
  }

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

  normalizeSingularResponse(instance) {
    return Promise.resolve(instance);
  }
}
