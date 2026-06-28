import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUserById } from '../api/users'
import Spinner from '../components/Spinner'
import type { User } from '../types/User'

// Displays the full detail view for a single user.
function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    // Loads user details based on the route parameter.
    async function loadUser() {
      const userId = Number(id)
      if (!userId) {
        setError('Invalid user id.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getUserById(userId)
        if (!ignore) {
          setUser(data)
          setError(null)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Unable to load user.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="container">
        <Spinner />
      </main>
    )
  }

  if (error || !user) {
    return (
      <main className="container">
        <Link className="back-link" to="/">
          Back
        </Link>
        <p className="error-message">{error ?? 'User not found.'}</p>
      </main>
    )
  }

  return (
    <main className="container">
      <Link className="back-link" to="/">
        Back
      </Link>
      <section className="detail">
        <h1>{user.name}</h1>
        <dl className="detail-list">
          <div>
            <dt>Username</dt>
            <dd>{user.username}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>{user.website}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              {user.address.street}, {user.address.suite}, {user.address.city}{' '}
              {user.address.zipcode}
            </dd>
          </div>
          <div>
            <dt>Company</dt>
            <dd>{user.company.name}</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}

export default UserDetail
