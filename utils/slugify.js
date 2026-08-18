const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special chars
    .replace(/[\s_-]+/g, '-')   // spaces -> single dash
    .replace(/^-+|-+$/g, '');   // trim leading/trailing dashes

module.exports = slugify;