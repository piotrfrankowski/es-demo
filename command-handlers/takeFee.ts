import { promisify } from 'util'
import { EventBus } from '../event-bus'
import { ReadRepository } from '../read-repository'
import { CommandHandler, PayEvent } from './types'
const wait = promisify(setTimeout)

export const takeFeeCommandHandlerFactory = (eventBus: EventBus, readRepository: ReadRepository): CommandHandler<PayEvent> => {
  const handle = async (command: PayEvent) => {
    // some business logic, calculate and trasnfer fee to bank
    const fee = command.amount * 0.01
    if (fee <= 0.01) {
      eventBus.publish({ ...command, error: 'Fee must be grater than 0.01' })
      return command.uuid
    }

    const event = {
      ...command,
      ts: new Date(),
      topic: 'takeFee',
      received: command.amount - fee,
      fee,
      user: command.user,
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