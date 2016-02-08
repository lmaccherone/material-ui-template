module.exports =
  getItem: (key) ->
    return JSON.parse(localStorage.getItem(key))

  setItem: (key, o) ->
    return localStorage.setItem(key, JSON.stringify(o))

  removeItem: (key) ->
    return localStorage.removeItem(key)
