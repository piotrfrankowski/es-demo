import { Event } from "../event-bus"

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


export type CommandHandler<T = PayEventDto> = {
  handle: (command: T) => Promise<string>
}