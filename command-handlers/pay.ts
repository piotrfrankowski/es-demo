import { v4 } from 'uuid'
import { promisify } from 'util'
import { EventBus } from '../event-bus'
import { ReadRepository } from '../read-repository'
import { CommandHandler, PayEventDto } from './types'
const wait = promisify(setTimeout)

export const payCommandHandlerFactory = (eventBus: EventBus, readRepository: ReadRepository): CommandHandler<PayEventDto> => {
  const handle = async (command: PayEventDto) => {
    const uuid = v4()
    const event = {
      uuid,
      ts: new Date(),
      topic: 'pay',
      ...command,
    }
    
    // perform some business logic
    if (command.amount <= 0) {
      eventBus.publish({ ...event, error: 'Amount must be greater than 0' })
      return uuid
    }
    if (command.user === command.recepient) {
      eventBus.publish({ ...event, error: 'Cannot pay yourself' })
      return uuid
    }

    // mock async operation
    await wait(1000)
    
    // publish event
    eventBus.publish(event)

    return event.uuid
  }

  return {
    handle,
  }
}