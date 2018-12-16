// TODO: ESLINT and Code Standards for Quasar
const fs = require('fs')
const Handlebars = require('handlebars')
const decode = require('ent/decode')
const _ = require('lodash')
const mkdirp = require('mkdirp')


// Load Quasar
const Quasar = require('../dist/quasar.umd.js')

// Base output Directory for template generation output
const outputDir = './__test__/'

// Prop Types Mapping for TS
const AttribTypeMap = new Map([
    [String, 'string;'],
    [Boolean, 'boolean;'],
    [Number, 'number;'],
    [Array, 'Array\<any\>;'],
    [Object, '{ property: any; }'],
    [Function, 'any;'],
    [RegExp, 'any;'],
    [Date, 'Date;']
])

/**
 * Details
 */
class QTypes {
    /**
     * Test Generator for Quasar
     */
    constructor() {
        /**
         * Allowed top level keys (Quasar.*) for generating QTypes
         * @type {string[]}
         */
        this.allowedKeys = ['components']

        this.template = fs.readFileSync('./build/templates/components.test.js.hbs', 'utf8').toString()

        /**
         * Placeholder for Type Definitions during recusion of Quasar Keys
         * @type {object}
         */
        this.cache = {}
    }

    /**
     * Check for Allowed Keys
     * @param qKey
     * @returns {boolean}
     */
    isAllowed(qKey) {
        return this.allowedKeys.indexOf(qKey) >= 0
    }

    /**
     * Check if key is private
     * @param qKey
     * @returns {boolean}
     */
    isPrivate(qKey) {
        return qKey.match('_') !== null
    }

    /**
     * Check if key is plugin
     * @param qKey
     * @returns {boolean}
     */
    isPlugin(qKey) {
        return qKey === 'plugin'
    }

    /**
     * Check if key component
     * @param qKey
     * @returns {boolean}
     */
    isComponent(qKey) {
        return qKey === 'components'
    }

    /**
     * Compile the current cache to disk
     */
    compileCache() {
        Object.keys(this.cache).forEach(qKey => {
            Object.keys(this.cache[qKey]).forEach(qClassName => {
              let matchSplit = qClassName.split(/(?=[A-Z])/)
              let folder = matchSplit.filter(text=>text !== "Q")
                .map(text => text.toLowerCase())
                .join('-')
              this.cache[qKey][qClassName].folder = folder
              this.compile(qKey, qClassName, this.cache[qKey][qClassName], this.template)
                // this.compile(`test/${qKey}`,
                //     `${qClassName}.test`,
                //     this.cache[qKey][qClassName],
                //     this.templates[qKey].test)
            })
        })
    }

    /**
     * Compile and write definiton
     * @param qKey
     * @param qClassName
     * @param data
     * @param source
     */
    compile(qKey, qClassName, data, source) {
        const template = Handlebars.compile(source, {strict: true});
        this.writeDefinitionFile(qKey, qClassName, template(data))
    }

    /**
     * Write Definition File
     * @param qKey Folder
     * @param qClassName Filename
     * @param data Data to write
     */
    writeDefinitionFile(qKey, qClassName, data) {
        fs.writeFileSync(`${outputDir}${qKey}/${qClassName}.test.js`, decode(data))
    }

    /**
     * Get the TS Type from the Map
     * @param type
     * @returns {any}
     */
    getTypeFromMap(type) {
        const v = AttribTypeMap.get(type)
        if (!AttribTypeMap.has(type)) {
            console.error('AttribTypeMap.get', v, type)
            throw new Error('AttribTypeMap.get - Needs an appropriate type mapping')
        }
        else {
            return AttribTypeMap.get(type)
        }
    }

    /**
     * Lookup component attributes and map them to a TS definition
     * TODO: Simplify
     * @param qCmp
     * @param qClassKey
     * @param data
     */
    attribTypeMapLookup(qCmp, qClassKey, data) {
        data[qClassKey] = {}
        let cmpAttrib = qCmp[qClassKey]

        // If it's an array of mixins
        if (Array.isArray(cmpAttrib) && qClassKey === 'mixins') {
            cmpAttrib.forEach((mixin) => {
                // first mixin get all keys
                if (typeof mixin === 'object') {
                    Object.keys(mixin).forEach((mixinKey) => {
                        if (typeof data[qClassKey][mixinKey] === 'undefined') data[qClassKey][mixinKey] = {}
                        if (typeof mixin[mixinKey] === 'object') {
                            Object.keys(mixin[mixinKey]).forEach((attib) => {
                                data[qClassKey][mixinKey][attib] = 'any;'
                            })
                        }

                    })
                }
            })
        }
        // If it's just a function
        else if (typeof cmpAttrib === 'function') {
            if (qClassKey === 'data') {
                // qCmp.value = 1
                data[qClassKey] = {
                    key: 'any;'
                }
            } else {
                data[qClassKey] = 'any;'
            }
        }
        // If it's most likely an object
        else if (typeof cmpAttrib === 'object') {
            Object.entries(cmpAttrib).map((entry) => {
                let yoo = qCmp
                let current = entry[1]
                let name = entry[0]

                // Check if this key is private
                if (!this.isPrivate(name)) {
                    // If this key is a function or object
                    if (typeof current === 'function' || typeof current === 'object') {
                        // If this key value has a property of type, map it to the dictionary
                        if (typeof current.type !== 'undefined') {
                            // Make sure we have a function to send to getTypeFromMap
                            if (typeof current.type === 'function') {
                                data[qClassKey][name] = this.getTypeFromMap(current.type)
                            } else if (Array.isArray(current.type)) {
                                let types = '('
                                current.type.forEach((type) => {
                                    types += `${this.getTypeFromMap(type)} | `
                                })
                                data[qClassKey][name] = types + ' any;)'
                            } else {
                                console.error(current.type)
                                throw new Error('Declared Type is not Handdled!')
                            }
                        } else {
                            // Has no type set to any
                            data[qClassKey][name] = 'any;'
                        }
                        // Handle top level types in object
                    } else if (typeof current === 'string' || typeof current === 'boolean') {
                        data[qClassKey][name] = this.getTypeFromMap(current.constructor)
                    } else {
                        throw new Error(`Cannot map!!! ${typeof current}`)
                    }


                }
            })
        } else {
            throw new Error('Something went wrong...')
        }
        console.log(data[qClassKey])
    }

    /**
     * Needs work! Take a Quasar Class and maps it's fields to the
     * apppropriate map. ie: AttribTypeMap for props
     * TODO: Better mapping of fields
     * @param qKey
     * @param qClassName
     * @param qClassKey
     * @returns {*}
     */
    massageVueToTypeDefinitionTemplate(qKey, qClass) {
        let QCmp = qClass
        console.log(`#################${QCmp.name}#################`)
        // Mark attributes as trouble
        let isTrouble = false

        // Placeholder for returning to cache
        let data = {}

        // NAME
        if (!_.isUndefined(QCmp.name)) {
            data.name = QCmp.name
        }

        let keyList = [
            'mounted',
            'inject',
            'provide',
            'mixins',
            'props',
            'directives',
            'watch',
            'computed',
            'data',
            'methods',
            'mounted',
            'created'
        ].forEach((qKey) => {
            if (!_.isUndefined(QCmp[qKey])) {
                console.log(`${QCmp.name}.${qKey}`)
                this.attribTypeMapLookup(QCmp, qKey, data)
            }
        })


        // Checking for missing attribs in the namespace for development purposes
        // All known attributes in this namespace are filtered and checked
        let filtered = Object.keys(QCmp).filter((key, indx, arr) => {
            let first = [
                'value',
                'mounted',
                'inject',
                'provide',
                'beforeCreate',
                'beforeMount',
                'beforeDestroy',
                'name',
                'mixins',
                'props',
                'directives',
                'watch',
                'computed',
                'data',
                'methods',
                'beforeDestroy',
                'render',
                'mounted',
                'created',
                'modelToggle'
            ].filter((known) => {
                return known === key || this.isPrivate(key)
            })
            return first.length === 0
        })

        if (filtered.length !== 0) {
            console.log(filtered)
            // throw new Error('Attrib not found, add it to the list!!')
        }

        return data
    }

    /**
     * Setup Directories for *.d.ts files
     * @param qKey
     */
    buildQKeyDir(qKey) {
        mkdirp.sync(`${outputDir}${qKey}`)
    }

    /**
     * Filter by allowedTypes
     * @param qKey
     * @returns {boolean}
     */
    checkQKey(qKey) {
        return this.isAllowed(qKey)
    }

    /**
     * Generate Quasar Types
     *   Filter the top level umd export by allowedKeys, setup directories
     *   and generate each type of type definition configured
     */
    build() {
        // Filter top level keys
        Object.keys(Quasar)
            .filter(qKey => {
                // Setup target directories and cache
                let isAllowed = this.checkQKey(qKey)
                if (isAllowed) this.buildQKeyDir(qKey)
                if (typeof this.cache[qKey] === 'undefined') this.cache[qKey] = {}
                // Check for configuration errors
                return isAllowed
            })
            .forEach((qKey) => {
                console.log(qKey)
                // Generate Types Cache for each of the found Classes
                Object.entries(Quasar[qKey])
                    .forEach(qClassEntry => {
                      console.log(qClassEntry[0])
                        this.cache[qKey][qClassEntry[0]] = this.massageVueToTypeDefinitionTemplate(qKey, qClassEntry[1].options)
                        // this.cache[qKey][qClassEntry[0]].fixtures = {height: 2, opened: true}
                    })
            })

        this.compileCache()
    }
}

new QTypes().build()
