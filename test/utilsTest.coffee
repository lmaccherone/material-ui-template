utils = require('../src/app/lumenize/utils')

exports.utilsTest =

  testMatch: (test) ->
    xmas = {'month': 12, 'day': 25}
    xmas2011 = {year: 2011, month:12, day: 25}
    someday = {year: 2011, month:12, day: 26}
    test.ok(utils.match(xmas, xmas2011), 'xmas should match xmas2011')
    test.equal(utils.match(xmas, someday), false, 'xmas2011 should not match some day')
    test.done()

  testFilterMatch: (test) ->
    o1 = {a: 1, b: [1, 2, 3], c: {x: 1, y: [10, 20], z: [{a: 100}, {b: 200}]}}
    o2 = {b: [1, 2, 3], c: {y: [10, 20], z: [{a: 100}, {b: 200}], x: 1}, a: 1}
    o3 = {b: [1, 2, 3]}
    test.ok(utils.filterMatch(o1, o2))
    test.ok(utils.filterMatch(o3, o1))
    test.equal(false, utils.filterMatch(o1, o3))
    test.done()

  compareTest: (test) ->
    a1 = [1, 2, 5]
    a2 = [1, 2, 3]
    test.equal(utils.compare(a1, a2), -1)
    test.done()

  cloneTest: (test) ->
    expected = {
      storedProcedureLink: 'dbs/dF0DAA==/colls/dF0DAIYxaAA=/sprocs/dF0DAIYxaAADAAAAAAAAgA==/',
      memo: {
        params: {},
        query: { query: '{"_OrgId":"e3999dce-36f4-186f-84b0-5f27d402be0c"}' },
        body: undefined,
        authorization: {}
      },
      debug: true
    }

    actual = utils.clone(expected)
    test.deepEqual(expected, actual)

    test.done()