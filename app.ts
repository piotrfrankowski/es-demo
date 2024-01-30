import { eventBusFactory } from './event-bus'
import { eventStoreFactory } from './event-store'
import { commandHandlerFactory } from './command-handler'
import { readRepositoryFactory } from './read-repository'
import { queryHandlerFactory } from './query-handler'
import { messageQueueFactory } from './message-queue'
import { serverFactory } from './server'

const start = () => {
  const readRepository = readRepositoryFactory()
  const eventStore = eventStoreFactory()
  const eventBus = eventBusFactory(eventStore)
  
  const commandHandler = commandHandlerFactory(eventBus, readRepository)
  const queryHandler = queryHandlerFactory(readRepository)

  const messageQueue = messageQueueFactory(eventBus, commandHandler)
  const app = serverFactory(commandHandler, queryHandler)

  // start message queue
  messageQueue()
  
  // start server
  const server = app.listen(3838, () => {
    console.log('Server started at port 3838')
  })

  // close event store
  process.on('SIGINT', () => {
    eventStore.close()
    server.close()
    process.exit()
  })
}

start()