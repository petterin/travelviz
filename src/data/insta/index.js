

const getItems = blob => 
  blob.data.user.edge_owner_to_timeline_media.edges

const data = [
  require('./08.json'),
  require('./07.json'),
  require('./06.json'),
  require('./05.json'),
  require('./04.json'),
  require('./03.json'),
  require('./02.json'),
  require('./01.json')
].map(getItems)
 .reduce((arr, items) => arr.concat(items), [])
 .reverse()
 .map(item => item.node)

export default data