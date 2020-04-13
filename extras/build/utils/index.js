const xmldom = require('xmldom')
const Parser = new xmldom.DOMParser()

const { resolve, basename } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const typeExceptions = [ 'g', 'svg', 'defs', 'style' ]

function getAttributes (el, list) {
  const att = {}

  list.forEach(name => {
    att[name] = parseFloat(el.getAttribute(name))
  })

  return att
}

const decoders = {
  path (el) {
    return el.getAttribute('d')
  },

  circle (el) {
    const att = getAttributes(el, [ 'cx', 'cy', 'r' ])
    return 'M' + (att.cx - att.r) + ',' + att.cy +
      'a' + att.r + ',' + att.r + ' 0 1,0 ' + (2 * att.r) + ',0' +
      'a' + att.r + ',' + att.r + ' 0 1,0'  + (-2 * att.r) + ',0'
  },

  ellipse (el) {
    const att = getAttributes(el, [ 'cx', 'cy', 'rx', 'ry' ])
    return 'M' + (att.cx - att.rx) + ',' + att.cy +
      'a' + att.rx + ',' + att.ry + ' 0 1,0 ' + (2 * att.rx) + ',0' +
      'a' + att.rx + ',' + att.ry + ' 0 1,0'  + (-2 * att.rx) + ',0'
  },

  polygon (el) {
    const points = el.getAttribute('points')
      .replace(/  /g, ' ')
      .trim()
      .split(/\s+|,/)

    const x0 = points.shift()
    const y0 = points.shift()

    return 'M' + x0 + ',' + y0 + 'L' + points.join(' ')
  },

  polyline (el) {
    return this.polygon(el)
  },

  rect (el) {
    const att = getAttributes(el, [ 'x', 'y', 'width', 'height' ])
    return 'M' + att.x + ',' + att.y + 'L' + (att.x + att.width) + ',' + att.y + ' ' +
      (att.x + att.width) + ',' + (att.y + att.height) + ' ' + att.x + ',' + (att.y + att.height)
  },

  line (el) {
    const att = getAttributes(el, [ 'x1', 'x2', 'y1', 'y2' ])
    return 'M' + att.x1 + ',' + att.y1 + 'L' + att.x2 + ',' + att.y2
  }
}

function parseDom (el, allPaths) {
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

    allPaths.push(
      decoders[type](el)
    )
  }

  Array.from(el.childNodes).forEach(child => {
    parseDom(child, allPaths)
  })
}

function parseSvgContent(name, content) {
  const dom = Parser.parseFromString(content, 'text/xml')

  const viewBox = dom.documentElement.getAttribute('viewBox')

  const allPaths = []
  try {
    parseDom(dom.documentElement, allPaths)
  }
  catch (err) {
    console.error(`[Error] "${name}" could not be parsed:`)
    throw err
  }

  if (allPaths.length === 0) {
    throw new Error(`Could not infer any paths for "${name}"`)
  }

  const dPath = allPaths.join('z').replace(/zz/gi, 'z')

  return {
    dPath,
    viewBox: viewBox !== '0 0 24 24' ? `|${viewBox}` : ''
  }
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

  const {dPath, viewBox} = parseSvgContent(name, content)

  return {
    svgDef: `export const ${name} = '${dPath}${viewBox}'`,
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