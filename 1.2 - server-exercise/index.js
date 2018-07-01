const { ApolloServer, gql } = require("apollo-server");

const frameworks = [
  {
    id: 1,
    title: "React",
    git: "https://github.com/facebook/react/",
    stars: 104170
  },
  {
    id: 2,
    title: "Vue",
    git: "https://github.com/vuejs/vue/",
    stars: 104483
  }
];

const typeDefs = gql`
  type Framework {
    id: ID!
    title: String
    git: String
    stars: Int
  }

  type Query {
    frameworks: [Framework]
    framework(id: ID!): Framework
  }
`

const resolvers = {
  Query: {
    frameworks: () => frameworks,
    framework: (_, params) => frameworks.find(f => f.id == params.id),
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

/* Queries

{
  frameworks {
    id,
    title,
    git,
  }
}

{
  framework(id: 2) {
    title,
    git,
  }
}

*/