import { v4 } from 'uuid'
import { promisify } from 'util'
import { Event, EventBus } from '../event-bus'
import { ReadRepository } from '../read-repository'
import { CommandHandler, PaymentDoneEvent } from './types'
const wait = promisify(setTimeout)

export const finalizeCommandHandlerFactory = (eventBus: EventBus, readRepository: ReadRepository): CommandHandler<PaymentDoneEvent> => {
  const handle = async (command: PaymentDoneEvent) => {
    const event = {
      ...command,
      ts: new Date(),
    }

    // mock async operation
    await wait(1000)

    // save to read repository
    readRepository.save(event)

    return command.uuid
  }

  return {
    handle,
  }
}