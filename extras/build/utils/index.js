const xmldom = require('xmldom')
const Parser = new xmldom.DOMParser()

const { resolve, basename } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const typeExceptions = [ 'g', 'svg', 'defs', 'style', 'title' ]

function getAttributes (el, list) {
  const att = {}

  list.forEach(name => {
    att[name] = parseFloat(el.getAttribute(name))
  })

  return att
}

function getCurvePath (x, y, rx, ry) {
  return `A${rx},${ry},0,0,1,${x},${y}`
}

const decoders = {
  path (el) {
    return el.getAttribute('d')
  },

  circle (el) {
    const att = getAttributes(el, [ 'cx', 'cy', 'r' ])
    return 'M' + (att.cx - att.r) + ',' + att.cy +
      'a' + att.r + ',' + att.r + ' 0 1,0 ' + (2 * att.r) + ',0' +
      'a' + att.r + ',' + att.r + ' 0 1,0'  + (-2 * att.r) + ',0' + 'Z'
  },

  ellipse (el) {
    const att = getAttributes(el, [ 'cx', 'cy', 'rx', 'ry' ])
    return 'M' + (att.cx - att.rx) + ',' + att.cy +
      'a' + att.rx + ',' + att.ry + ' 0 1,0 ' + (2 * att.rx) + ',0' +
      'a' + att.rx + ',' + att.ry + ' 0 1,0'  + (-2 * att.rx) + ',0' + 'Z'
  },

  polygon (el) {
    return this.polyline(el) + 'z'
  },

  polyline (el) {
    const points = el.getAttribute('points')
      .replace(/  /g, ' ')
      .trim()
      .split(/\s+|,/)

    const x0 = points.shift()
    const y0 = points.shift()

    return 'M' + x0 + ',' + y0 + 'L' + points.join(' ')
  },

  rect (el) {
    const att = getAttributes(el, [ 'x', 'y', 'width', 'height', 'rx', 'ry' ])
    return isNaN(att.rx)
      ? 'M' + att.x + ',' + att.y + 'L' + (att.x + att.width) + ',' + att.y + ' ' +
        (att.x + att.width) + ',' + (att.y + att.height) + ' ' + att.x + ',' + (att.y + att.height) + 'Z'
      : 'M' + (att.x + att.rx) + ',' + att.y +
        'L' + (att.x + att.width - att.rx) + ',' + att.y +
        getCurvePath(att.x + att.width, att.y + att.ry, att.rx, att.ry) +
        'L' + (att.x + att.width) + ',' + (att.y + att.height - att.ry) +
        getCurvePath(att.x + att.width - att.rx, att.y + att.height, att.rx, att.ry) +
        'L' + (att.x + att.rx) + ',' + (att.y + att.height) +
        getCurvePath(att.x, att.y + att.height - att.ry, att.rx, att.ry) +
        'L' + att.x + ',' + (att.y + att.ry) +
        getCurvePath(att.x + att.rx, att.y, att.rx, att.ry) + 'Z'
  },

  line (el) {
    const att = getAttributes(el, [ 'x1', 'x2', 'y1', 'y2' ])
    return 'M' + att.x1 + ',' + att.y1 + 'L' + att.x2 + ',' + att.y2
  }
}

function parseDom (el, pathsDefinitions) {
  const type = el.nodeName

  if (
    el.getAttribute === void 0 ||
    el.getAttribute('opacity') === '0'
  ) {
    return
  }

  if (typeExceptions.includes(type) === false) {
    if (decoders[type] === void 0) {
      throw new Error(`Encountered unknown tag type: "${type}"`)
    }

    pathsDefinitions.push({
      path: decoders[type](el),
      style: el.getAttribute('style'),
      transform: el.getAttribute('transform')
    })
  }

  Array.from(el.childNodes).forEach(child => {
    parseDom(child, pathsDefinitions)
  })
}

function parseSvgContent(name, content) {
  const dom = Parser.parseFromString(content, 'text/xml')

  const viewBox = dom.documentElement.getAttribute('viewBox')
  const pathsDefinitions = []

  try {
    parseDom(dom.documentElement, pathsDefinitions)
  }
  catch (err) {
    console.error(`[Error] "${name}" could not be parsed:`)
    throw err
  }

  if (pathsDefinitions.length === 0) {
    throw new Error(`Could not infer any paths for "${name}"`)
  }

  const result = {
    viewBox: viewBox !== '0 0 24 24' ? `|${viewBox}` : ''
  }

  if (pathsDefinitions.every(def => !def.style && !def.transform)) {
    result.paths = pathsDefinitions
      .map(def => def.path)
      .join('z')
      .replace(/zz/gi, 'z')
  }
  else {
    result.paths = pathsDefinitions
      .map(def => {
        return def.path +
          (def.style ? `@@${def.style.replace(/#[0-9a-fA-F]{3,6}/g, 'currentColor')}` : (def.transform ? '@@' : '')) +
          (def.transform ? `@@${def.transform}` : '')
      })
      .join('&&')
  }

  return result
}

function getBanner(iconSetName, versionOrPackageName) {
  const version =
    versionOrPackageName.match(/^\d/)
    ? versionOrPackageName
    : require(resolve(__dirname, `../../node_modules/${versionOrPackageName}/package.json`)).version

  return `/* ${iconSetName} v${version} */\n\n`
}

module.exports.defaultNameMapper = (filePath, prefix) => {
  return (prefix + '-' + basename(filePath, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase());
}

module.exports.extract = (filePath, name) => {
  const content = readFileSync(filePath, 'utf-8')

  const { paths, viewBox } = parseSvgContent(name, content)

  return {
    svgDef: `export const ${name} = '${paths}${viewBox}'`,
    typeDef: `export declare const ${name}: string;`
  }
}

module.exports.writeExports = (iconSetName, versionOrPackageName, distFolder, svgExports, typeExports, skipped) => {
  if (svgExports.length === 0) {
    console.log(`WARNING. ${iconSetName} skipped completely`)
  }
  else {
    const banner = getBanner(iconSetName, versionOrPackageName);
    const distIndex = `${distFolder}/index`

    writeFileSync(`${distIndex}.js`, banner + svgExports.join('\n'), 'utf-8')
    writeFileSync(`${distIndex}.d.ts`, banner + typeExports.join('\n'), 'utf-8')

    if (skipped.length > 0) {
      console.log(`${iconSetName} - skipped (${skipped.length}): ${skipped}`)
    }
  }
}
