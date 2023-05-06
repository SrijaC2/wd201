// eslint-disable-next-line no-unused-vars
const { request, response } = require('express')
const express = require('express')
const app = express()
const csrf = require('tiny-csrf')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(bodyParser.json())
const { Todo } = require('./models')
const path = require('path')
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('shh! some secret string'))
app.use(csrf('this_should_be_32_character_long', ['POST', 'PUT', 'DELETE']))

app.set('view engine', 'ejs')
app.get('/', async (request, response) => {
  const overdue = await Todo.overdue()
  const dueToday = await Todo.dueToday()
  const dueLater = await Todo.dueLater()
  const CompletedItems = await Todo.completedItems()
  if (request.accepts('html')) {
    response.render('index', {
      title: 'Todo Application',
      overdue,
      dueToday,
      dueLater,
      CompletedItems,
      csrfToken: request.csrfToken()
    })
  } else {
    response.json({
      overdue,
      dueToday,
      dueLater,
      CompletedItems
    })
  }
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/todos', async (request, response) => {
  console.log('Todo list')
  try {
    const todoL = await Todo.findAll()
    return response.send(todoL)
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.post('/todos', async (request, response) => {
  console.log('Creating a todo', request.body)
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false
    })
    return response.redirect('/')
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

// PUT http://mytodoapp.com/todos/123/markAsCompleted
app.put('/todos/:id', async (request, response) => {
  console.log('We have to update a todo with ID:', request.params.id)
  const todo = await Todo.findByPk(request.params.id)
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed)
    return response.json(updatedTodo)
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.delete('/todos/:id', async (request, response) => {
  console.log('Delete a todo by ID: ', request.params.id)
  try {
    await Todo.remove(request.params.id)
    return response.json({ success: true })
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

module.exports = app
