"use strict";

/**
 * @class JSONSerializer
 * @constructor
 */
export default class JSONSerializer {
  /**
   * Returns an array of Sequelize instances
   *
   * @method normalizeArrayResponse
   * @param {Array} instances Sequelize instances
   * @return {Promise}<Object, Error>
   *
   * @example
   * ```javascript
   * return orm.findAll("user").then(users => {
   *   return serializer.normalizeArrayResponse(instances);
   * }).then(response => {
   *   /**
   *    * [{
   *    *   firstName: "foo",
   *    *   lastName; "bar"
   *    * }]
   * });
   * ```
   */
  normalizeArrayResponse(instances) {
    return Promise.resolve(instances);
  }

  /**
   * Takes one or several Sequelize intances and returns them.
   *
   * @method normalizeResponse
   * @param {Object} instance
   * @param {String} method
   * @return {Promise}<Object, Error>
   *
   * @example
   * ```javascript
   * return orm.findOne("user", 1).then(user => {
   *   return serializer.normalizeResponse(user, "findOne");
   * }).then(response => {
   *   /**
   *    * {
   *    *   firstName: "foo",
   *    *   lastName; "bar"
   *    * }
   * })
   *
   * return orm.findAll("user").then(users => {
   *   return serializer.normalizeResponse(users, "findAll");
   * }).then(response => {
   *   /**
   *    * [{
   *    *   firstName: "foo",
   *    *   lastName: "bar"
   *    * }]
   * });
   * ```
   */
  normalizeResponse(instance, method, fallbackName) {
    switch (method) {
      case "createRecord":
      case "findOne":
      case "queryRecord":
      case "updateRecord":
        return this.normalizeSingularResponse(instance, fallbackName);
      case "findAll":
        return this.normalizeArrayResponse(instance, fallbackName);
      default:
        return this.normalizeSingularResponse(instance, fallbackName);
    }
  }

  /**
   * Returns a single sequelize instance
   *
   * @method normalizeSingularResponse
   * @param {Object} instance Sequelize model instance
   * @return {Promise}<Object, Error>
   *
   * @example
   * ```javascript
   * return orm.findOne("user", 1).then(user => {
   *   return serializer.normalizeSingularResponse(instance, "findOne");
   * }).then(response => {
   *   /**
   *    * {
   *    *   firstName: "foo",
   *    *   lastName; "bar"
   *    * }
   * });
   * ```
   */
  normalizeSingularResponse(instance) {
    return Promise.resolve(instance);
  }
}
