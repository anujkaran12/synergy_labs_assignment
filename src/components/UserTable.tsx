import { Link } from 'react-router-dom'
import type { User } from '../types/User'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

// Renders users as a desktop table and mobile card stack.
function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return <p className="empty-state">No users found.</p>
  }

  return (
    <>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link className="name-link" to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <div className="action-group">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => onDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="user-cards">
        {users.map((user) => (
          <article className="user-card" key={user.id}>
            <Link className="name-link" to={`/users/${user.id}`}>
              {user.name}
            </Link>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <div className="action-group">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onEdit(user)}
              >
                Edit
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default UserTable
