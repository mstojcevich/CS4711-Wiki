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

  return client.action(
    schema,
    action,
    params,
  ).then(response => ({
    title: response.name,
    quillDelta: JSON.parse(response.content),
  })).catch(error => error);
}

function createArticle(client, schema, params) {
  const action = ['api', 'articles', 'create'];

  return client.action(
    schema,
    action,
    params,
  ).then(response => (
    response.id
  )).catch(error => error);
}

const requests = [
  getArticle,
  createArticle,
];

export default requests;
