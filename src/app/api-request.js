import superagent from 'superagent/lib/client'

module.exports = function(method, endpoint, body, callback) {

  if (!(callback)) {
    callback = body
    body = null
  }

  method = method.toUpperCase()

  return superagent(method, endpoint).accept('json').send(body).end(function(err, response) {
    if (err) {
      console.error(err)
    }
    if (callback) {  // Calling even if there is an error so calling page knows why
      return callback(err, response)
    }
  }
  )
}