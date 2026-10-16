// Parses Google News RSS XML into a short list of headlines.
// Titles look like "כותרת - שם המקור"; we split off the source name.

const MAX_ITEMS = 12
const MAX_TITLE_CHARS = 90

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function clip(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export function parseRss(xml) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = itemRe.exec(xml)) && items.length < MAX_ITEMS) {
    const block = m[1]
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/)
    const dateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
    if (!titleMatch) continue

    const raw = decodeEntities(titleMatch[1]).trim()
    const dash = raw.lastIndexOf(' - ')
    const title = dash > 0 ? raw.slice(0, dash) : raw
    const source = dash > 0 ? raw.slice(dash + 3) : ''

    items.push({
      title: clip(title, MAX_TITLE_CHARS),
      source,
      date: dateMatch ? decodeEntities(dateMatch[1]).trim() : ''
    })
  }
  return items
}
