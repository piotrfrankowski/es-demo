import { promisify } from 'util'
import { EventBus } from '../event-bus'
import { ReadRepository } from '../read-repository'
import { CommandHandler, PaymentDoneEvent } from './types'
const wait = promisify(setTimeout)

export const transferCommandHandlerFactory = (eventBus: EventBus, readRepository: ReadRepository): CommandHandler<PaymentDoneEvent> => {
  const handle = async (command: PaymentDoneEvent) => {
    // some business logic, transfer money to recepient, etc.
    const event = {
      ...command,
      ts: new Date(),
      topic: 'paymentDone',
    }

    // save to read repository
    readRepository.save(event)

    // mock async operation
    await wait(1000)

    // publish event
    eventBus.publish(event)

    return command.uuid
  }

  return {
    handle,
  }
}