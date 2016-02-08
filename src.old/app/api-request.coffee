superagent = require('superagent/lib/client')
history = require('./history')
JSONStorage = require('./JSONStorage')

module.exports = (endpoint, body, callback) ->
  ###
  Assumes you want GET if body is missing, otherwise uses POST
  ###
  unless callback?
    callback = body
    body = null

  session = JSONStorage.getItem('session')
  if session?.id? or endpoint is '/login' or endpoint is '/create-tenant'
    if body?
      if session?.id?
        body.sessionID = session.id
      superagent.post(endpoint).accept('json').send(body).end((err, response) ->
        if err? and err.status in [401]
          JSONStorage.removeItem('session')
          history.replace('/login')
        if callback?  # Calling even if there is an error so login page knows why
          callback(err, response)
      )
  else  # No session?.id
    JSONStorage.removeItem('session')
    history.replace('/login')
