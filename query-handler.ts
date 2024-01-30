import { PaymentDoneEvent } from './command-handler'
import { ReadRepository } from './read-repository'

export type QueryHandler = {
  getBalance: (user: string) => number
  getBankBalance: () => number
  getHistory: (user: string) => { paid: PaymentDoneEvent[], received: PaymentDoneEvent[] }
  getOne: (uuid: string) => PaymentDoneEvent
}

export const queryHandlerFactory = (readRepository: ReadRepository): QueryHandler => {
  const getBalance = (user: string) => {
    const receiveEvents = readRepository.readByRecepient(user)
    const payEvents = readRepository.readByPayer(user)
    const paid = payEvents.reduce((acc, e) => {
      return acc - e.amount
    }, 0)
    const received = receiveEvents.reduce((acc, e) => {
      return acc + e.received
    }, 0)
    return paid + received
  }

  const getBankBalance = () => {
    const payEvents = readRepository.getAll()
    return payEvents.reduce((acc, e) => {
      return acc + e.fee
    }, 0)
  }

  const getHistory = (user: string) => {
    return {
      paid: readRepository.readByPayer(user),
      received: readRepository.readByRecepient(user),
    }
  }

  const getOne = (uuid: string) => {
    return readRepository.getOne(uuid)
  }

  return {
    getBalance,
    getBankBalance,
    getHistory,
    getOne,
  }
}