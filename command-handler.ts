import { v4 } from 'uuid'
import { promisify } from 'util'
import { Event, EventBus } from './event-bus'
import { ReadRepository } from './read-repository'
const wait = promisify(setTimeout)

export type PayEventDto = {
  amount: number,
  token: string,
  user: string,
  recepient: string,
}

export type PayEvent = PayEventDto & Event

export type PaymentDoneEvent = {
  fee: number,
  received: number,
} & PayEvent

export type CommandHandler = {
  pay: (command: PayEventDto) => Promise<string>
  takeFee: (command: PayEvent) => Promise<string>
  finalize: (command: PaymentDoneEvent) => Promise<string>
  finalizeWithError: (command: PaymentDoneEvent) => Promise<string>
}

export const commandHandlerFactory = (eventBus: EventBus, readRepository: ReadRepository) => {
  const pay = async (command: PayEventDto) => {
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

  const takeFee = async (command: PayEvent) => {
    // some business logic, check user balance, etc.
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

  const finalize = async (command: PaymentDoneEvent) => {
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

  const finalizeWithError = async (command: PaymentDoneEvent) => {
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
    pay,
    takeFee,
    finalize,
    finalizeWithError,
  }
}