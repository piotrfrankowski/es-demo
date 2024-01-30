import { writeFileSync, readFileSync } from 'fs'
import { CommandHandler } from '../command-handlers/types'

export const messageQueueFactory = (commandHandlers: Record<string, CommandHandler>) => () => {
  setInterval(() => {
    try {
      const events = JSON.parse(readFileSync('./bus.json', 'utf-8'))
      const handledEventsUuids = []
      if (events.length) {
        events.forEach((event) => {
          console.log('processing event', event.topic, event.uuid)
          if (commandHandlers[event.topic]) {
            commandHandlers[event.topic].handle(event)
            handledEventsUuids.push(event.uuid)
          }
        })
      }
      writeFileSync('./bus.json', JSON.stringify(events.filter((event) => !handledEventsUuids.includes(event.uuid))))
    } catch (error) {
      console.log(error)
    }
  }, 500)
}