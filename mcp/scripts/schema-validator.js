import { URL } from 'node:url'

function describePath(path) {
  return path.length === 0 ? 'value' : path.join('.')
}

function validateType(value, type) {
  if (type === 'array') return Array.isArray(value)
  if (type === 'object') {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }
  if (type === 'integer') return Number.isInteger(value)
  if (type === 'null') return value === null
  return typeof value === type
}

export function validateSchema(value, schema, path = []) {
  const errors = []
  const location = describePath(path)

  if (schema.const !== void 0 && value !== schema.const) {
    errors.push(`${location} must equal ${JSON.stringify(schema.const)}`)
  }

  if (schema.type !== void 0 && !validateType(value, schema.type)) {
    return [`${location} must be of type ${schema.type}`]
  }

  if (typeof value === 'string') {
    if (schema.minLength !== void 0 && value.length < schema.minLength) {
      errors.push(
        `${location} must contain at least ${schema.minLength} character(s)`
      )
    }
    if (schema.pattern !== void 0 && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${location} must match ${schema.pattern}`)
    }
    if (schema.format === 'uri' && URL.canParse(value) === false) {
      errors.push(`${location} must be a URI`)
    }
  }

  if (Array.isArray(value) && schema.items !== void 0) {
    value.forEach((item, index) => {
      errors.push(
        ...validateSchema(item, schema.items, [...path, String(index)])
      )
    })
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      if (Object.hasOwn(value, required) === false) {
        errors.push(`${location} is missing required property ${required}`)
      }
    }

    for (const [key, child] of Object.entries(value)) {
      const propertySchema = schema.properties?.[key]

      if (propertySchema !== void 0) {
        errors.push(...validateSchema(child, propertySchema, [...path, key]))
      } else if (schema.additionalProperties === false) {
        errors.push(`${location} contains unknown property ${key}`)
      } else if (typeof schema.additionalProperties === 'object') {
        errors.push(
          ...validateSchema(child, schema.additionalProperties, [...path, key])
        )
      }
    }
  }

  return errors
}
