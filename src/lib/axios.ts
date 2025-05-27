// lib/axios.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://zcoder-backend-9aq1.onrender.com',
  withCredentials: false, // Only needed if using cookies
})

instance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default instance
