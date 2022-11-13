/**
 * Fields in a request to update a single TODO item.
 */
export interface TodoUpdateRequest {
  name: string
  dueDate: string
  done: boolean
}