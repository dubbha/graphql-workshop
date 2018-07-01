const axios = require("axios");
const Sequelize = require("sequelize");
require("dotenv").config({ path: "../.env" });

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

const Framework = sequelize.define("frameworks", {
  name: {
    type: Sequelize.STRING
  },
  git: {
    type: Sequelize.STRING
  },
  stars: { type: Sequelize.INTEGER, defaultValue: 0 },
  description: { type: Sequelize.STRING, defaultValue: "" },
  avatar: { type: Sequelize.STRING, defaultValue: "" },
});

// When changing the DB you will need to run this with force true that will clean the DB and add the new coloumns
Framework.sync({ force: true });
// Framework.sync();

module.exports = {
  Query: {
    frameworks: () => Framework.findAll()
  },
  Mutation: {
    addFramework: async (_, { name, git }) => {
      try {
        const url = git.split("https://github.com/")[1];
        const gh = await axios(`https://api.github.com/repos/${url}`);

        // data is at:
        // description: gh.data.description,
        //  avatar: gh.data.owner.avatar_url

        const framework = await Framework.create({
          name,
          git,
          stars: gh.data.stargazers_count,
          description: gh.data.description,
          avatar: gh.data.owner.avatar_url,
        });

        return framework;
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};

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

frameworks {
  name,
  git,
  stars,
  description,
  avatar,
}

*/
