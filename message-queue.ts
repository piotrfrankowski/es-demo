import { CommandHandler } from './command-handler'
import { EventBus } from './event-bus'

export const messageQueueFactory = (eventBus: EventBus, commandHandler: CommandHandler) => () => {
  eventBus.emitter.on('pay', (event) => {
    console.log(event)
    commandHandler.takeFee(event)
  })

  eventBus.emitter.on('takeFee', (event) => {
    console.log(event)
    commandHandler.finalize(event)
  })

  eventBus.emitter.on('paymentDone', (event) => {
    console.log(event)
  })

  eventBus.emitter.on('error', (event) => {
    console.log('Event failed', event)
    commandHandler.finalizeWithError(event)
  })
}