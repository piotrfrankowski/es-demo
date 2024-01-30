import { writeFileSync, readFileSync } from 'fs'
import { Event } from './event-bus'

export type EventStore = {
  save: <T extends Event>(event: T) => void
  read: (uuid: string) => Event[]
  close: () => void
}

export const eventStoreFactory = (): EventStore => {
  const persisted = readFileSync('./store.json').toString()
  const storage: Event[] = persisted ? JSON.parse(persisted) : []

  const save = <T extends Event>(event: T) => {
    storage.push(event)
  }

  const read = (uuid: string) => {
    return storage.filter((e) => e.uuid === uuid)
  }

  const close = () => {
    writeFileSync('./store.json', JSON.stringify(storage))
  }

  return {
    save,
    read,
    close,
  }
}
