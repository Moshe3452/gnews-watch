// Runs on the PHONE (Zepp app side service). The watch has no internet,
// so it asks this service for headlines over Bluetooth.
import { BaseSideService } from '@zeppos/zml/base-side'
import { parseRss } from '../shared/parse.js'

// Change this line to use another topic or country.
const FEED_URL = 'https://news.google.com/rss?hl=iw&gl=IL&ceid=IL:iw'

AppSideService(
  BaseSideService({
    onRequest(req, res) {
      if (req.method === 'GET_NEWS') {
        fetch({ url: FEED_URL, method: 'GET' })
          .then((response) => {
            const items = parseRss(response.body || '')
            res(null, { items })
          })
          .catch((err) => {
            res(null, { error: String(err) })
          })
      } else {
        res(null, { error: 'unknown method' })
      }
    }
  })
)
