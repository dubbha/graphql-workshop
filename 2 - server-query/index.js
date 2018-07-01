require("dotenv").config({ path: "../.env" });
const { ApolloServer, gql } = require("apollo-server");
const Sequelize = require("sequelize");

const DB_USERNAME = 'ehkjrbazzaojdc';
const DB_PASSWORD = 'c05eae357eafd901d62b86dd62532f397b7001fffc7294fdc26e20f1c699f033';
const DB_HOST = 'ec2-79-125-127-60.eu-west-1.compute.amazonaws.com';
const DB = 'd2nqp63rcm14jn';

const sequelize = new Sequelize(
  `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:5432/${DB}`,
  {
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }
);

sequelize.sync({ force: true });

const Framework = sequelize.define("frameworks", {
  name: {
    type: Sequelize.STRING
  },
  git: {
    type: Sequelize.STRING
  }
});

const typeDefs = gql`
  type Framework {
    id: ID!
    name: String
    git: String
  }

  type Query {
    frameworks: [Framework]
  }

  input frameworkInput {
    name: String
    git: String
  }

  type Mutation {
    addFramework(params:frameworkInput): Framework
  }
 
`;


const resolvers = {
  Query: {
    frameworks: () => Framework.findAll()
  },

  Mutation: {
    addFramework: async(_, { params: { name, git } }) => {
      const createdFramework = await Framework.create({
        name,
        git,
      });

      return createdFramework;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

/*


mutation {
	addFramework(
  	name: "React"
  	git: "https://github.com/facebook/react",
	) {
  	name,
  	git,
    stars,
    description,
    avatar,
	}
}


mutation {
	addFramework(
  	name: "Vue"
  	git: "https://github.com/vuejs/vue",
	) {
  	name,
  	git,
    stars,
    description,
    avatar,
	}
}



{
  frameworks {
    id,
    name,
    git,
    stars,
    description,
    avatar,
 }
}

*/