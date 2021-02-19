module.exports.slugify = str => encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
