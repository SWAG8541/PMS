import React, { useState, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authSuccess } from '../../redux/authSlice'
import axios from 'axios'

function Login() {
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Check if user is already logged in
  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  const handleRegisterRedirect = () => {
    navigate('/register')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setErrorMessage('')
      setSuccessMessage('')
    } else {
      setErrors({})
       try {
        const res = await axios.post('http://localhost:5000/api/auth/login', formData)

        // Store token in localStorage
        localStorage.setItem('token', res.data.token)
        
        // Store user data in localStorage for persistence
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
        }
        
        // Add this line to update Redux state
        dispatch(authSuccess({ 
          user: res.data.user || { email: formData.email }, 
          token: res.data.token 
        }))
        
        setSuccessMessage('Logged in successfully')
        setErrorMessage('')
        
        // Navigate to dashboard
        setTimeout(() => navigate('/dashboard'), 1000)
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Login failed')
        setSuccessMessage('')
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
      <div className="bg-white p-4 rounded shadow" style={{ width: '300px' }}>
        <h3 className="text-center mb-3">Login</h3>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-2">
            Login
          </Button>
        </Form>

        <div className="text-center mt-2">
          <p className="mb-1">Don't Have an Account?</p>
          <Button variant="light" onClick={handleRegisterRedirect} className="w-100 border">
            Register
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login