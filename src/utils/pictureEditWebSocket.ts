export default class PictureEditWebSocket {
  private pictureId: number
  private socket: WebSocket | null
  private eventHandlers: any

  constructor(pictureId: number) {
    this.pictureId = pictureId
    this.socket = null
    this.eventHandlers = {}
  }

  connect() {
    const url = `ws://localhost:8080/api/ws/picture/edit?pictureId=${this.pictureId}`
    this.socket = new WebSocket(url)

    this.socket.binaryType = 'blob'

    this.socket.onopen = () => {
      console.log('WebSocket 连接已建立')
      this.triggerEvent('open')
    }

    this.socket.onmessage = (event) => {
      const eventData = JSON.parse(event.data)
      console.log('收到消息', eventData)
      const type = eventData.type
      this.triggerEvent(type, eventData)
    }

    this.socket.onclose = (event) => {
      console.log('WebSocket 连接已关闭:', event)
      this.triggerEvent('close', event)
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket 错误', error)
      this.triggerEvent('error', error)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      console.log('WebSocket 连接已关闭')
    }
  }

  sendMessage(message: object) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('消息已发送:', message)
    } else {
      console.error('WebSocket未连接，无法发送消息:', message)
    }
  }

  on(type: string, handler: (data?: any) => void) {
    if (!this.eventHandlers[type]) {
      this.eventHandlers[type] = []
    }
    this.eventHandlers[type].push(handler)
  }

  triggerEvent(type: string, data?: any) {
    const handlers = this.eventHandlers[type]
    if (handlers) {
      handlers.forEach((handler: any) => {
        handler(data)
      })
    }
  }
}
