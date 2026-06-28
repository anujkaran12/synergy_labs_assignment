// Defines user shapes used by the API layer and forms.
export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company: {
    name: string
  }
}

export interface UserFormData {
  name: string
  username: string
  email: string
  phone: string
}
