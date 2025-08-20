export interface IMessageEvent {
    data: string | object
    id?: string
    type?: string
    retry?: number
}