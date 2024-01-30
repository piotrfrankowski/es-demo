import { eventBusFactory } from '../event-bus'
import { eventStoreFactory } from '../event-store'
import { readRepositoryFactory } from '../read-repository'
import { queryHandlerFactory } from '../query-handler'
import { serverFactory } from '../server'
import { payCommandHandlerFactory } from '../command-handlers/pay'

const start = () => {
  const readRepository = readRepositoryFactory()
  const eventStore = eventStoreFactory(readRepository)
  const eventBus = eventBusFactory(eventStore)
  
  const payCommandHandler = payCommandHandlerFactory(eventBus, readRepository)
  const queryHandler = queryHandlerFactory(readRepository)

  const app = serverFactory(payCommandHandler, queryHandler)
  
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