/**
 * This file defines the requests we need to make to the API as functions that will be configured
 * by ./APIHandler.jsx
 *
 * Each request will be passed a client and schema objects from coreAPI, and a params objects that
 * contains the properties required to perform the request.
 *
 * Each request MUST return a promise or the app will crash when using them.
 */

/**
 * Get an article from the API based on the id given in params
 *
 * @param {Object} client coreAPI client, supplied by APIHandler
 * @param {Object} schema coreAPI schema, supplied by APIHandler
 * @param {Object} params object containing desired article's id
 * {
 *   id: {string|number}
 * }
 *
 * @return {Object}
 * {
 *   title: {String} article title,
 *   quillDelta: {Object} used by the quill editor library to render article contents
 * }
 */
function getArticle(client, schema, params) {
  const action = ['api', 'articles', 'read'];

  try {
    return client.action(
      schema,
      action,
      params,
    ).then(response => ({
      title: response.name,
      quillDelta: JSON.parse(response.content),
    })).catch(error => error);
  } catch (e) {
    return new Promise((resolve, reject) => reject(e));
  }
}

/**
 * Get a list of articles from the API
 *
 * @param {Object} client coreAPI client, supplied by APIHandler
 * @param {Object} schema coreAPI schema, supplied by APIHandler
 *
 * @return {Array}
 * [
 *   {
 *      title: {string} title of the article,
 *      link: {string} a link to the article that can be resolved by the UI,
 *      id: {number} the id of the article
 *      creation_date: {string} iso8601 datestring of the article's creation time
 *   }
 * ]
 */
function getArticles(client, schema) {
  const action = ['api', 'articles', 'list'];

  try {
    return client.action(
      schema,
      action,
    ).then(response => response).catch(console.error);
  } catch (e) {
    return new Promise((resolve, reject) => reject(e));
  }
}

/**
 * Create a new article as an authenticated user
 * @param {Object} client coreAPI client, supplied by APIHandler
 * @param {Object} schema coreAPI schema, supplied by APIHandler
 * @param {Object} params article content formatted as quill data
 * {
 *    name: {string} article title,
 *    content: {object} quill data object that has article content and formatting
 * }
 */
function createArticle(client, schema, params) {
  const action = ['api', 'articles', 'create'];

  try {
    return client.action(
      schema,
      action,
      params,
    ).then(response => (
      response.id
    ));
  } catch (e) {
    return new Promise((resolve, reject) => reject(e));
  }
}

const requests = [
  getArticle,
  getArticles,
  createArticle,
];

export default requests;
