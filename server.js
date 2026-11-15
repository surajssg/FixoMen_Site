import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { emailHealth, sendBulkEnquiry, sendEnquiry, sendOrder } from './services/emailApi.js'

const app = express()
const port = Number(process.env.PORT) || 3001
const projectDirectory = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.join(projectDirectory, 'dist')

app.use(express.json({ limit: '12kb' }))
app.get('/api/health', emailHealth)
app.post('/api/enquiries', sendEnquiry)
app.post('/api/bulk-enquiries', sendBulkEnquiry)
app.post('/api/orders', sendOrder)
app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }))
app.use(express.static(distDirectory))
app.use((request, response, next) => {
  if (request.method !== 'GET') return next()
  return response.sendFile(path.join(distDirectory, 'index.html'), (error) => {
    if (error) next(error)
  })
})

app.listen(port, () => {
  console.log(`FIXO MEN server listening on port ${port}`)
})