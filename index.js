
const chalk = require('chalk')
const caniuse = require('caniuse-db/data')
const prefix_match = /\sx($|\s)/
const flag_match = /\sd($|\s)/

const browsers = {
  chrome: 58,
  firefox: 53,
  edge: 15,
  ie: 11,
  safari: 10.1,
  opera: 46
}

for(const name in caniuse.data) {
  const data = caniuse.data[name]
  const hits = []

  if (data.categories.indexOf('CSS') === -1) {
    continue
  }

  for (const browser in data.stats) {
    
    if (Object.keys(browsers).indexOf(browser) === -1) { 
      continue
    }

    const versions = data.stats[browser]
    
    const latest = Object.keys(versions).reduce((memo, version) => {

      const item = versions[version]
      const prefix = item.match(prefix_match)
      const flag = item.match(flag_match)

      if (!flag && !prefix) {
        return memo
      }

      version = parseFloat(version)

      if (memo.version < version && browsers[browser] <= version) {
        return {version, flag, prefix}
      }

      return memo

    }, {version: 0})

    if (latest.version > 0) {
      hits.push(`${browser} ${latest.version} [${latest.flag ? 'F' : ''}${latest.prefix ? 'P' : ''}]`)
    }

  }

  if (hits.length > 0) {
    console.log(chalk.red.bold(data.title) + ': ' + hits.join(', '))
  }

}
