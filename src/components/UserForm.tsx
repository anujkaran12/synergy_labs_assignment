import { useEffect, useState } from 'react'
import type { UserFormData } from '../types/User'

interface UserFormProps {
  initialData?: UserFormData
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
  loading: boolean
}

const emptyForm: UserFormData = {
  name: '',
  username: '',
  email: '',
  phone: '',
}

// Collects user fields for create and edit flows.
function UserForm({ initialData, onSubmit, onCancel, loading }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(initialData ?? emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    setFormData(initialData ?? emptyForm)
    setError('')
  }, [initialData])

  // Updates a single controlled input field.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  // Validates required fields before handing data to the page.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const hasEmptyField = Object.values(formData).some((value) => !value.trim())
    if (hasEmptyField) {
      setError('All fields are required.')
      return
    }

    setError('')
    onSubmit({
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    })
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit User' : 'Add User'}</h2>
      {error && <p className="form-error">{error}</p>}

      <label>
        Name
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Username
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Phone
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default UserForm
