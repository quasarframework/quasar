const packageName = 'lucide-static'
const distName = 'lucide-icons'
const iconSetName = 'Lucide'
const prefix = 'luc'

// ------------

const { globSync } = require('tinyglobby')
const { copySync } = require('fs-extra')
const { writeFileSync } = require('fs')
const { resolve, join } = require('path')

const skipped = []
const distFolder = resolve(__dirname, `../${ distName }`)
const { defaultNameMapper, writeExports, extractSvg } = require('./utils')
const { readFileSync } = require('fs')

// Custom extract function for Lucide icons that handles relative paths correctly
function extractLucide(filePath, name) {
  const content = readFileSync(filePath, 'utf-8')
  
  // The real issue is that the utils path decoder adds M0 0z prefix for paths starting with 'm'
  // We need to override this behavior temporarily
  const utils = require('./utils')
  
  // Store the original extractSvg function
  const originalExtractSvg = utils.extractSvg
  
  // Create a modified version that doesn't add M0 0z prefix
  function customExtractSvg(content, name) {
    const { parseSvgContent } = utils
    
    // Monkey-patch the path decoder temporarily
    const xmldom = require('@xmldom/xmldom')
    const Parser = new xmldom.DOMParser()
    
    // Override just the path processing part
    const originalParseSvgContent = parseSvgContent
    
    // Custom parseSvgContent that avoids the M0 0z issue
    function lucideParseSvgContent(name, content) {
      let viewBox
      const pathsDefinitions = []
      
      try {
        const dom = Parser.parseFromString(content, 'text/xml')
        viewBox = dom.documentElement.getAttribute('viewBox')
        
        if (!viewBox) {
          const width = parseFloat(dom.documentElement.getAttribute('width') || '0')
          const height = parseFloat(dom.documentElement.getAttribute('height') || '0')
          if (width > 0 && height > 0) {
            viewBox = `0 0 ${width} ${height}`
          }
        }
        
        // Parse all elements (paths, circles, rects, etc.) but without the M0 0z issue
        function parseElement(el) {
          const type = el.nodeName
          
          if (el.getAttribute === undefined || el.getAttribute('opacity') === '0') return
          
          const typeExceptions = ['g', 'svg', 'defs', 'style', 'title']
          
          if (!typeExceptions.includes(type)) {
            let pathData = ''
            
            if (type === 'path') {
              const points = el.getAttribute('d')?.trim()
              if (points) {
                // Don't add M0 0z prefix for relative paths!
                pathData = points
              }
            } else if (type === 'circle') {
              const cx = parseFloat(el.getAttribute('cx') || 0)
              const cy = parseFloat(el.getAttribute('cy') || 0)
              const r = parseFloat(el.getAttribute('r') || 0)
              pathData = `M${cx} ${cy} m-${r}, 0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0`
            } else if (type === 'rect') {
              const x = parseFloat(el.getAttribute('x') || 0)
              const y = parseFloat(el.getAttribute('y') || 0)
              const width = parseFloat(el.getAttribute('width') || 0)
              const height = parseFloat(el.getAttribute('height') || 0)
              pathData = `M${x} ${y}H${x + width}V${y + height}H${x}Z`
            } else if (type === 'line') {
              const x1 = parseFloat(el.getAttribute('x1') || 0)
              const y1 = parseFloat(el.getAttribute('y1') || 0)
              const x2 = parseFloat(el.getAttribute('x2') || 0)
              const y2 = parseFloat(el.getAttribute('y2') || 0)
              pathData = `M${x1},${y1}L${x2},${y2}`
            } else if (type === 'polygon') {
              const points = el.getAttribute('points')?.trim()
              if (points) {
                // Convert polygon points to path data
                const coords = points.split(/[\s,]+/).filter(p => p.length > 0)
                if (coords.length >= 4 && coords.length % 2 === 0) {
                  pathData = `M${coords[0]} ${coords[1]}`
                  for (let i = 2; i < coords.length; i += 2) {
                    pathData += `L${coords[i]} ${coords[i + 1]}`
                  }
                  pathData += 'Z' // Close the polygon
                }
              }
            } else if (type === 'ellipse') {
              const cx = parseFloat(el.getAttribute('cx') || 0)
              const cy = parseFloat(el.getAttribute('cy') || 0)
              const rx = parseFloat(el.getAttribute('rx') || 0)
              const ry = parseFloat(el.getAttribute('ry') || 0)
              // Convert ellipse to path using arc commands
              pathData = `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`
            }
            
            if (pathData) {
              // Get styles from SVG attributes
              const fill = el.getAttribute('fill') || dom.documentElement.getAttribute('fill') || 'none'
              const stroke = el.getAttribute('stroke') || dom.documentElement.getAttribute('stroke') || 'currentColor'
              const strokeWidth = el.getAttribute('stroke-width') || dom.documentElement.getAttribute('stroke-width') || '2'
              const strokeLinecap = el.getAttribute('stroke-linecap') || dom.documentElement.getAttribute('stroke-linecap') || 'round'
              const strokeLinejoin = el.getAttribute('stroke-linejoin') || dom.documentElement.getAttribute('stroke-linejoin') || 'round'
              
              const style = `fill:${fill};stroke:${stroke};stroke-width:${strokeWidth};stroke-linecap:${strokeLinecap};stroke-linejoin:${strokeLinejoin};`
              
              pathsDefinitions.push({
                path: pathData,
                style: style,
                transform: el.getAttribute('transform') || ''
              })
            }
          }
          
          // Recursively process child elements
          Array.from(el.childNodes).forEach(child => {
            if (child.nodeType === 1) { // Element node
              parseElement(child)
            }
          })
        }
        
        parseElement(dom.documentElement)
        
      } catch (err) {
        console.error(`[Error] "${name}" could not be parsed: ${err.message}`)
        throw err
      }
      
      if (pathsDefinitions.length === 0) {
        throw new Error(`Could not infer any paths for "${name}"`)
      }
      
      const tmpView = viewBox !== '0 0 24 24' && viewBox ? `|${viewBox}` : ''
      
      const result = {
        viewBox: tmpView
      }
      
      if (pathsDefinitions.every((def) => !def.style && !def.transform)) {
        result.paths = pathsDefinitions.map((def) => def.path).join('')
      } else {
        result.paths = pathsDefinitions
          .map((def) => {
            let stylePart = def.style ? `@@${def.style}` : ''
            const transformPart = def.transform ? `@@${def.transform}` : ''
            
            if (!def.style && def.transform) {
              stylePart = '@@'
            }
            
            return `${def.path}${stylePart}${transformPart}`
          })
          .join('&&')
      }
      
      return result
    }
    
    const { paths, viewBox } = lucideParseSvgContent(name, content)
    const path = paths.replace(/[\r\n\t]+/gi, ',').replace(/,,/gi, ',')
    
    return {
      svgDef: `export const ${name} = '${path}${viewBox}'`,
      typeDef: `export declare const ${name}: string;`
    }
  }
  
  return customExtractSvg(content, name)
}

const svgFolder = resolve(
  __dirname,
  `../node_modules/${ packageName }/icons/`
)
const svgFiles = globSync(svgFolder + '/*.svg')
let iconNames = new Set()

const svgExports = []
const typeExports = []

svgFiles.forEach((file) => {
  const name = defaultNameMapper(file, prefix)

  if (iconNames.has(name)) return

  try {
    const { svgDef, typeDef } = extractLucide(file, name)
    svgExports.push(svgDef)
    typeExports.push(typeDef)

    iconNames.add(name)
  }
  catch (err) {
    console.error(err)
    skipped.push(name)
  }
})

iconNames = [ ...iconNames ]
svgExports.sort((a, b) => {
  return ('' + a).localeCompare(b)
})
typeExports.sort((a, b) => {
  return ('' + a).localeCompare(b)
})
iconNames.sort((a, b) => {
  return ('' + a).localeCompare(b)
})

writeExports(
  iconSetName,
  packageName,
  distFolder,
  svgExports,
  typeExports,
  skipped
)

copySync(
  resolve(__dirname, `../node_modules/${ packageName }/LICENSE`),
  resolve(__dirname, `../${ distName }/LICENSE`)
)

// write the JSON file
const file = resolve(__dirname, join('..', distName, 'icons.json'))
writeFileSync(file, JSON.stringify([ ...iconNames ].sort(), null, 2), 'utf-8')

console.log(`${ distName } done with ${ iconNames.length } icons`)
