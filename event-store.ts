import { writeFileSync, readFileSync } from 'fs'
import { Event } from './event-bus'
import { ReadRepository } from './read-repository'
import { PaymentDoneEvent } from './command-handlers/types'

export type EventStore = {
  save: <T extends Event>(event: T) => void
  read: (uuid: string) => Event[]
  close: () => void
}

export const eventStoreFactory = (readRepository?: ReadRepository): EventStore => {
  const persisted = readFileSync('./store.json').toString()
  const storage: Event[] = persisted ? JSON.parse(persisted) : []
  if (persisted && readRepository) {
    storage.filter(event => event.topic === 'paymentDone').forEach((event) => {
      readRepository.save(event as PaymentDoneEvent)
    })
  }
  const interval = setInterval(() => {
    writeFileSync('./store.json', JSON.stringify(storage))
  }, 500)

  const save = <T extends Event>(event: T) => {
    storage.push(event)
  }

  const read = (uuid: string) => {
    return storage.filter((e) => e.uuid === uuid)
  }

  const close = () => {
    writeFileSync('./store.json', JSON.stringify(storage))
    clearInterval(interval)
  }

  return {
    save,
    read,
    close,
  }
}
