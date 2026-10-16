// Runs on the WATCH. Shows the headlines from the phone side service.
import { BasePage } from '@zeppos/zml/base-page'
import { getDeviceInfo } from '@zos/device'
import { createWidget, widget, align, prop, event } from '@zos/ui'

const { width, height } = getDeviceInfo()
const ROW_H = 80

Page(
  BasePage({
    state: { items: [] },

    build() {
      createWidget(widget.TEXT, {
        x: 0, y: 20, w: width, h: 40,
        text: 'גוגל חדשות',
        text_size: 26,
        color: 0x4f8cff,
        align_h: align.CENTER_H
      })

      this.list = createWidget(widget.TEXT, {
        x: 30, y: 70, w: width - 60, h: height - 140,
        text: 'טוען...',
        text_size: 22,
        color: 0xf2f2f5,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V
      })

      // Long press or tap the bottom line to refresh.
      createWidget(widget.BUTTON, {
        x: 80, y: height - 60, w: width - 160, h: 44,
        text: 'רענון',
        text_size: 18,
        normal_color: 0x1c1c24,
        press_color: 0x2a2a33,
        color: 0x8a8a96,
        radius: 22,
        click_func: () => this.load()
      })

      this.load()
    },

    load() {
      this.request({ method: 'GET_NEWS' })
        .then((data) => {
          if (data.error) {
            this.list.setProperty(prop.TEXT, 'שגיאה: ' + data.error)
            return
          }
          const lines = data.items.map((it) => `• ${it.title}`)
          this.list.setProperty(prop.TEXT, lines.join('\n\n') || 'אין כותרות')
        })
        .catch((err) => {
          this.list.setProperty(prop.TEXT, 'אין חיבור לטלפון')
        })
    }
  })
)
