import { EventStore } from './event-store'
import { EventEmitter } from 'node:events'

export type EventBus = {
  publish: <T extends Event>(event: T) => void
  emitter: EventEmitter
}

export type Event = {
  uuid: string
  ts: Date
  topic: string
  error?: string
}

export const eventBusFactory = (eventStore: EventStore): EventBus => {
  const emitter = new EventEmitter()
  const publish = <T extends Event>(event: T) => {
    eventStore.save(event)
    if (event.error) {
      emitter.emit('error', event)
      return
    }
    emitter.emit(event.topic, event)
  }

  return {
    publish,
    emitter,
  }
}