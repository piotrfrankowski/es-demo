import { eventBusFactory } from '../event-bus'
import { eventStoreFactory } from '../event-store'
import { readRepositoryFactory } from '../read-repository'
import { messageQueueFactory } from './message-queue'
import { transferCommandHandlerFactory } from '../command-handlers/transfer'

const start = () => {
  const readRepository = readRepositoryFactory()
  const eventStore = eventStoreFactory()
  const eventBus = eventBusFactory(eventStore)
  
  const commandHandlers = {
    takeFee: transferCommandHandlerFactory(eventBus, readRepository)
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