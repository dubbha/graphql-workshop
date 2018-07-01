const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql `
    type Movie {
        id: ID!
        title: String
    }

    type Query {
        movies: [Movie]
    }
`
