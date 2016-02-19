import superagent from 'superagent/lib/client';

module.exports = function(endpoint, body, callback) {
  /*
  Assumes you want GET if body is missing, otherwise uses POST
  */
  let method;

  if (!(callback)) {
    callback = body;
    body = null;
  }

  if (body) {
    method = 'POST';
  } else {
    method = 'GET';
  }

  return superagent(method, endpoint).accept('json').send(body).end(function(err, response) {
    if (err && err.status === 401) {
//        JSONStorage.removeItem('session')
//        history.replace('/login')
      console.log(err);
    }
    if (callback) {  // Calling even if there is an error so login page knows why
      return callback(err, response);
    }
  }
  );
};