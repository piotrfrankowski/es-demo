import { eventStoreFactory } from './event-store'

const start = (uuid: string) => {
  const eventStore = eventStoreFactory()
  const events = eventStore.read(uuid)

  console.log(`
uuid | ${uuid}
-------------------------------------------
${JSON.stringify(events, null, 2)}`)
}

start(process.argv[2])