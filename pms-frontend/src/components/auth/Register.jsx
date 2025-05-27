import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import axios from 'axios'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSuccessMessage('')
      setErrorMessage('')
    } else {
      setErrors({})
      try {
        const res = await axios.post('http://localhost:5000/api/auth/register', formData)
        setSuccessMessage(res.data.message || 'Registration successful')
        setErrorMessage('')
        setFormData({ name: '', email: '', password: '' })
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Registration failed')
        setSuccessMessage('')
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
      <div className="bg-white p-4 rounded shadow" style={{ width: '300px' }}>
        <h3 className="text-center mb-3">Register</h3>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          {/* Email */}
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

          {/* Password */}
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

          <Button variant="success" type="submit" className="w-100 mb-2">
            Register
          </Button>
        </Form>

        <div className="text-center mt-2">
          <p className="mb-1">Already Have an Account</p>
          <Button variant="light" className="w-100 border">Login</Button>
        </div>
      </div>
    </div>
  )
}

export default Register
