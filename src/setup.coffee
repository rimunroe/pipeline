isNode = typeof window == 'undefined'

if isNode
  _ = require 'lodash'
else
  _ = this._

pipeline = {}
