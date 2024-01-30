import { PaymentDoneEvent } from './command-handler'

export type ReadRepository = {
  // internal function
  save: (event: PaymentDoneEvent) => void

  // exposed to query handler
  readByPayer: (payer: string) => PaymentDoneEvent[]
  readByRecepient: (recepient: string) => PaymentDoneEvent[]
  getOne: (uuid: string) => PaymentDoneEvent
  getAll: () => PaymentDoneEvent[]
  // and so on...
}

export const readRepositoryFactory = (): ReadRepository => {
  // simulated diffent views
  const byPayer: Record<string, PaymentDoneEvent[]> = {}
  const byRecepient: Record<string, PaymentDoneEvent[]> = {}
  const byUuid: Record<string, PaymentDoneEvent> = {}

  const save = (event: PaymentDoneEvent) => {
    if (!byPayer[event.user]) {
      byPayer[event.user] = []
    }
    byPayer[event.user].push(event)
    if (!byRecepient[event.recepient]) {
      byRecepient[event.recepient] = []
    }
    byRecepient[event.recepient].push(event)
    byUuid[event.uuid] = event
  }

  const readByPayer = (payer: string) => {
    return byPayer[payer]?.filter((e) => !e.error) || []
  }

  const readByRecepient = (recepient: string) => {
    return byRecepient[recepient]?.filter((e) => !e.error) || []
  }

  const getOne = (uuid: string) => {
    return byUuid[uuid]
  }

  const getAll = () => {
    return Object.values(byUuid)?.filter((e) => !e.error) || []
  }

  return {
    save,
    readByPayer,
    readByRecepient,
    getOne,
    getAll,
  }
}