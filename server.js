const graphql = require('graphql').graphql
const express = require('express')
const graphqlHTTP = require('express-graphql')
const Schema = require('./schema')

const PORT = 8080

const query = `
query {
  todos {
    id,
    title,
    completed
  }
}
`

graphql(Schema, query).then((result) => {
  console.log(JSON.stringify(result, null, ' '))
})

const app = express()
.use('/', graphqlHTTP({
  schema: Schema,
  pretty: true 
}))
.listen(PORT, () => {
  console.log(`listening to port *:${PORT}`)
})


