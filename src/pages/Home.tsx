import { useEffect, useState } from 'react'
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../api/users'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'
import UserForm from '../components/UserForm'
import UserTable from '../components/UserTable'
import type { User, UserFormData } from '../types/User'

type ToastState = { message: string; type: 'success' | 'error' }

// Manages the user list and all CRUD interactions.
function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    let ignore = false

    // Loads initial users from JSONPlaceholder.
    async function loadUsers() {
      try {
        setLoading(true)
        const data = await getUsers()
        if (!ignore) {
          setUsers(data)
          setError(null)
        }
      } catch (err) {
        if (!ignore) {
          const message = getErrorMessage(err)
          setError(message)
          setToast({ message, type: 'error' })
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [])

  // Creates a user and places it at the top of the local list.
  async function handleCreate(data: UserFormData) {
    try {
      setSubmitting(true)
      const createdUser = await createUser(data)
      setUsers((current) => [
        {
          ...createdUser,
          id: createdUser.id || Date.now(),
          address: createdUser.address ?? {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
          },
          company: createdUser.company ?? { name: '' },
          website: createdUser.website ?? '',
        },
        ...current,
      ])
      setShowForm(false)
      setToast({ message: 'User created successfully.', type: 'success' })
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Updates a user in the local list after a successful API call.
  async function handleUpdate(data: UserFormData) {
    if (!editingUser) {
      return
    }

    try {
      setSubmitting(true)
      const updatedUser = await updateUser(editingUser.id, data)
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...updatedUser,
                id: editingUser.id,
                address: updatedUser.address ?? user.address,
                company: updatedUser.company ?? user.company,
                website: updatedUser.website ?? user.website,
              }
            : user,
        ),
      )
      setEditingUser(null)
      setToast({ message: 'User updated successfully.', type: 'success' })
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Deletes a user locally after JSONPlaceholder accepts the request.
  async function handleDelete(id: number) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this user?',
    )

    if (!shouldDelete) {
      return
    }

    try {
      setSubmitting(true)
      await deleteUser(id)
      setUsers((current) => current.filter((user) => user.id !== id))
      setToast({ message: 'User deleted successfully.', type: 'success' })
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Opens the form with the selected user's values.
  function handleEdit(user: User) {
    setEditingUser(user)
    setShowForm(false)
  }

  // Resets both create and edit form states.
  function handleCancel() {
    setShowForm(false)
    setEditingUser(null)
  }

  const formInitialData = editingUser
    ? {
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone,
      }
    : undefined

  return (
    <main className="container">
      <div className="page-heading">
        <div>
          <h1>Users</h1>
          <p>Manage names, contact details, and profiles.</p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            setShowForm(true)
            setEditingUser(null)
          }}
        >
          Add User
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {(showForm || editingUser) && (
        <UserForm
          initialData={formInitialData}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          loading={submitting}
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}

// Converts unknown errors into user-facing text.
function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.'
}

export default Home
