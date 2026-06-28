import type { User, UserFormData } from '../types/User'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Parses API responses and turns failed responses into readable errors.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, options)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

// Fetches all users.
export async function getUsers(): Promise<User[]> {
  return request<User[]>('/users')
}

// Fetches one user by id.
export async function getUserById(id: number): Promise<User> {
  return request<User>(`/users/${id}`)
}

// Creates a new user.
export async function createUser(data: UserFormData): Promise<User> {
  return request<User>('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

// Updates an existing user.
export async function updateUser(id: number, data: UserFormData): Promise<User> {
  return request<User>(`/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

// Deletes an existing user.
export async function deleteUser(id: number): Promise<void> {
  await request<void>(`/users/${id}`, { method: 'DELETE' })
}
