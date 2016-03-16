module.exports = function(method, endpoint, body, callback) {

  if (!(callback)) {
    callback = body
    body = null
  }
  method = method.toUpperCase()
  let options = {method: method}
  if (body) {
    options.body = JSON.stringify(body)
  }

  fetch(endpoint, options).then((response) => {
    if (response.status >= 300) {
      return callback({status: response.status, statusText: response.statusText})
    } else {
      response.json().then((json) => {
        callback(null, json)
      })
    }
  })
}
