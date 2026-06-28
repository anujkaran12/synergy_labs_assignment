import { useEffect, useState } from 'react'
import {
  createUser as createUserApi,
  deleteUser as deleteUserApi,
  getUsers,
  updateUser as updateUserApi,
} from '../api/users'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'
import UserForm from '../components/UserForm'
import UserTable from '../components/UserTable'
import type { User, UserFormData } from '../types/User'

type ToastState = { message: string; type: 'success' | 'error' }

const emptyAddress = {
  street: '',
  suite: '',
  city: '',
  zipcode: '',
}

const emptyCompany = { name: '' }

// Manages the user list and all CRUD interactions.
function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
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

      const createdUser = await createUserApi(data)
      const idAlreadyExists = users.some((user) => user.id === createdUser.id)
      const userToAdd: User = {
        ...createdUser,
        ...data,
        id: idAlreadyExists ? Date.now() : createdUser.id,
        address: createdUser.address ?? emptyAddress,
        company: createdUser.company ?? emptyCompany,
        website: createdUser.website ?? '',
      }

      setUsers([userToAdd, ...users])
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

      const updatedUser = await updateUserApi(editingUser.id, data)
      const updatedUsers = users.map((user) => {
        if (user.id !== editingUser.id) {
          return user
        }

        return {
          ...user,
          ...updatedUser,
          ...data,
          id: editingUser.id,
          address: updatedUser.address ?? user.address,
          company: updatedUser.company ?? user.company,
          website: updatedUser.website ?? user.website,
        }
      })

      setUsers(updatedUsers)
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
      setDeletingUserId(id)
      await deleteUserApi(id)

      const remainingUsers = users.filter((user) => user.id !== id)
      setUsers(remainingUsers)
      setToast({ message: 'User deleted successfully.', type: 'success' })
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' })
    } finally {
      setDeletingUserId(null)
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
          {!loading && <span className="user-count">{users.length} users</span>}
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
        <UserTable
          users={users}
          deletingUserId={deletingUserId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
