import { readFileSync, writeFileSync } from 'fs'
import { EventStore } from './event-store'

export type EventBus = {
  publish: <T extends Event>(event: T) => void
}

export type Event = {
  uuid: string
  ts: Date
  topic: string
  error?: string
}

export const eventBusFactory = (eventStore: EventStore): EventBus => {
  const publish = <T extends Event>(event: T) => {
    eventStore.save(event)
    const bus = JSON.parse(readFileSync('./bus.json').toString())
    bus.push({
      ...event,
      topic: event.error ? 'error' : event.topic,
    })
    writeFileSync('./bus.json', JSON.stringify(bus))
  }

  return {
    publish,
  }
}