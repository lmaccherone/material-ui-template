exports.MAX_INT = 2147483647  # using the signed 32 version because that's all we'll need and it enables bitwise ops
exports.MIN_INT = -2147483648

class ErrorBase extends Error
  constructor: (@message = 'Unknown error.') ->
    if Error.captureStackTrace?
      Error.captureStackTrace(this, @constructor)
    @name = @constructor.name

  toString: ->
    return "#{@name}: #{@message}"

class AssertException extends ErrorBase

assert = (exp, message) ->
  if (!exp)
    throw new exports.AssertException(message)

# Uses the properties of obj1, so will still match if obj2 has extra properties.
match = (obj1, obj2) ->
  for key, value of obj1
    if (value != obj2[key])
      return false
  return true

exactMatch = (a, b) ->
  return true if a is b
  atype = typeof(a); btype = typeof(b)
  return false if atype isnt btype
  return false if (!a and b) or (a and !b)
  return false if atype isnt 'object'
  return false if a.length and (a.length isnt b.length)
  return false for key, val of a when !(key of b) or not exactMatch(val, b[key])
  return true

# At the top level, it will match even if obj1 is missing some elements that are in obj2, but at the lower levels, it must be an exact match.
filterMatch = (obj1, obj2) ->
  unless type(obj1) is 'object' and type(obj2) is 'object'
    throw new Error('obj1 and obj2 must both be objects when calling filterMatch')
  for key, value of obj1
    if not exactMatch(value, obj2[key])
      return false
  return true

trim = (val) ->
  return if String::trim? then val.trim() else val.replace(/^\s+|\s+$/g, "")
  
startsWith = (bigString, potentialStartString) ->
  return bigString.substring(0, potentialStartString.length) == potentialStartString

isArray = (a) ->
  return Object.prototype.toString.apply(a) == '[object Array]'
  
type = do ->  # from http://arcturo.github.com/library/coffeescript/07_the_bad_parts.html
  classToType = {}
  for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
    classToType["[object " + name + "]"] = name.toLowerCase()

  (obj) ->
    strType = Object::toString.call(obj)
    classToType[strType] or "object"
    
clone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj

  if obj instanceof Date
    return new Date(obj.getTime())

  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags)

  newInstance = new obj.constructor()

  for key of obj
    newInstance[key] = clone(obj[key])

  return newInstance

keys = Object.keys or (obj) ->
  return (key for key, val of obj)

values = (obj) ->
  return (val for key, val of obj)

log = (s) ->
  if document?.createElement?
    pre = document.createElement('pre')
    pre.innerHTML = s
    document.body.appendChild(pre)
  else
    console.log(s)

compare = (a, b) ->  # Used for sorting any type
  if a is null
    return 1
  if b is null
    return -1
  switch type(a)
    when 'number', 'boolean', 'date'
      return b - a
    when 'array'
      for value, index in a
        if b.length - 1 >= index and value < b[index]
          return 1
        if b.length - 1 >= index and value > b[index]
          return -1
      if a.length < b.length
        return 1
      else if a.length > b.length
        return -1
      else
        return 0
    when 'object', 'string'
      aString = JSON.stringify(a)
      bString = JSON.stringify(b)
      if aString < bString
        return 1
      else if aString > bString
        return -1
      else
        return 0
    else
      throw new Error("Do not know how to sort objects of type #{utils.type(a)}.")

encodeUtf8 = (s) ->
  return unescape(encodeURIComponent(s))

decodeUtf8 = (s) ->
  return decodeURIComponent(escape(s))

# LZW-compress a string
lzwEncode = (s) ->
  s = encodeUtf8(s)
  dict = {}
  data = (s + "").split("")
  out = []
  currChar = undefined
  phrase = data[0]
  code = 256
  i = 1

  while i < data.length
    currChar = data[i]
    if dict[phrase + currChar]?
      phrase += currChar
    else
      out.push (if phrase.length > 1 then dict[phrase] else phrase.charCodeAt(0))
      dict[phrase + currChar] = code
      code++
      phrase = currChar
    i++
  out.push (if phrase.length > 1 then dict[phrase] else phrase.charCodeAt(0))
  i = 0

  while i < out.length
    out[i] = String.fromCharCode(out[i])
    i++

  return out.join ""

# Decompress an LZW-encoded string
lzwDecode = (s) ->
  dict = {}
  data = (s + "").split("")
  currChar = data[0]
  oldPhrase = currChar
  out = [currChar]
  code = 256
  phrase = undefined
  i = 1

  while i < data.length
    currCode = data[i].charCodeAt(0)
    if currCode < 256
      phrase = data[i]
    else
      phrase = (if dict[currCode] then dict[currCode] else (oldPhrase + currChar))
    out.push phrase
    currChar = phrase.charAt(0)
    dict[code] = oldPhrase + currChar
    code++
    oldPhrase = phrase
    i++

  outS = out.join("")
  return decodeUtf8(outS)

exports.log = log
exports.AssertException = AssertException
exports.assert = assert
exports.match = match
exports.filterMatch = filterMatch
exports.trim = trim
exports.startsWith = startsWith
exports.isArray = isArray
exports.type = type
exports.clone = clone
exports.keys = keys
exports.values = values
exports.compare = compare
exports.lzwEncode = lzwEncode
exports.lzwDecode = lzwDecode
exports._ = require('underscore')
