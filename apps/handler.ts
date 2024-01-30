import { eventBusFactory } from '../event-bus'
import { eventStoreFactory } from '../event-store'
import { readRepositoryFactory } from '../read-repository'
import { messageQueueFactory } from './message-queue'
import { takeFeeCommandHandlerFactory } from '../command-handlers/takeFee'
import { finalizeCommandHandlerFactory } from '../command-handlers/finalizeWithError'

const start = () => {
  const readRepository = readRepositoryFactory()
  const eventStore = eventStoreFactory()
  const eventBus = eventBusFactory(eventStore)
  
  const commandHandlers = {
    pay: takeFeeCommandHandlerFactory(eventBus, readRepository),
    error: finalizeCommandHandlerFactory(eventBus, readRepository),
    paymentDone: finalizeCommandHandlerFactory(eventBus, readRepository),
  }

  const messageQueue = messageQueueFactory(commandHandlers)

  // start message queue
  messageQueue()

  // close event store
  process.on('SIGINT', () => {
    eventStore.close()
    process.exit()
  })
}

start()