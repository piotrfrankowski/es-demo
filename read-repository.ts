import { readFileSync, writeFileSync } from 'fs'
import { PaymentDoneEvent } from './command-handlers/types'

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
  let byPayer: Record<string, PaymentDoneEvent[]> = {}
  let byRecepient: Record<string, PaymentDoneEvent[]> = {}
  let byUuid: Record<string, PaymentDoneEvent> = {}

  setInterval(() => {
    const data = JSON.parse(readFileSync('./read-repo.json', 'utf-8').toString())
    byPayer = data.byPayer
    byRecepient = data.byRecepient
    byUuid = data.byUuid
  }, 500)

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
    writeFileSync('./read-repo.json', JSON.stringify({
      byPayer,
      byRecepient,
      byUuid,
    }))
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