const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const schema = buildSchema(`
  type ExampleClass {
    greet(message: String!): String
    scold: String
  }

  input MessageInput {
    content: String
    author: String
  }
  type Message {
    id: ID!
    content: String
    author: String
  }
  type Query {
    hello: String
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int):[Int]
    getExampleMessage(message: String): ExampleClass
    getMessage: String
  }

  type Mutation {
    setMessage(message: String): String
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }


`)

class ExampleClass {
  constructor (message) {
    this.message = message
  }
  scold () {
    return 'Why la'
  }
  greet ({message}) {
    console.log('greet', message)
    return this.message + message
  }
}
let fakeDatabase = {}
const root = {
  hello: () => 'Hello World!',
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within'
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3]
  },
  rollDice: function ({numDice, numSides}) {
    var output = []
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)))
    }
    return output
  },
  getExampleMessage: ({message}) => {
    return new ExampleClass(message)
  },
  setMessage ({message}) {
    fakeDatabase.message = message
    return message
  },
  getMessage () {
    return fakeDatabase.message
  }
}
const app = express()

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

const PORT = 4000
app.listen(PORT, () => console.log(`listening to port *:${PORT}. browse to localhost:${PORT}/graphql`))
