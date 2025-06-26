import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";

const defs = gql`
  type User {
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    accessLevel: Int!
  }

  type Course {
    courseID: String!
    name: String!
    description: String
  }

  type Query {
    users: [User!]!
    courses: [Course!]!
  }

  type Mutation {
    suspendUser(username: String!): Boolean!
    renewUser(username: String!): Boolean!
    createCourse(courseID: String!, name: String!, description: String): Course!
    updateCourse(courseID: String!, name: String, description: String): Course!
    deleteCourse(courseID: String!): Boolean!
  }
`;

const resolvers = {
   Query: {

   },
   Mutation: {
    
   }
}

const server = new ApolloServer({defs, resolvers});
startStandaloneServer(server, {
    listen: {port: 3010}
}).then(
    (result) => {
        console.log("GraphQL server is running on port 3010");
    }
).catch(
    (error) => {
        console.log("Error running GraphQL server");
    }
)