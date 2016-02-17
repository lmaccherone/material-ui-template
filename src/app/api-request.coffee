superagent = require('superagent/lib/client')

module.exports = (endpoint, body, callback) ->
  ###
  Assumes you want GET if body is missing, otherwise uses POST
  ###
  unless callback?
    callback = body
    body = null

  if body?
    method = 'POST'
  else
    method = 'GET'

  superagent(method, endpoint).accept('json').send(body).end((err, response) ->
    if err? and err.status in [401]
#        JSONStorage.removeItem('session')
#        history.replace('/login')
      console.log(err)
    if callback?  # Calling even if there is an error so login page knows why
      callback(err, response)
  )