export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  this.timing = 2000;      // delay for each request, automatically set to 0 during testing

  this.get('/test.json', () => {
    let num = Math.random() * 100|0;
    return `{"foo": ${num}}`;
  });
}
