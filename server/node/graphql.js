import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import { getAll, getOne, alterOne } from "./dbops.js";

const defs = gql`
  type User {
    username: String!
    fName: String!
    lName: String!
    email: String!
    aLevel: Int!
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

  type Response {
    error: Boolean!
    message: String!
  }

  type Mutation {
    suspendUser(username: String!): Response!
    renewUser(username: String!): Response!
    createCourse(courseID: String!, name: String!, description: String): Course!
    updateCourse(courseID: String!, name: String, description: String): Course!
    deleteCourse(courseID: String!): Boolean!
  }
`;

const switchStatus = async (username, block) => {
  let currentAccessL;
  try{
    const userCreds = await getOne("Auth", "username", username);
    if(userCreds){
      if(userCreds.accessL){
        currentAccessL = userCreds.accessL;
      }
    }
  }catch(error){
    return {"error": true, "message": "User not found"};
  }
  if(currentAccessL){
    let newAccessL;
    if(block){
      switch(currentAccessL){
        case 0:
          newAccessL = 10;
          break;
        case 1:
          newAccessL = 11;
          break;
      }
    }else{
      switch(currentAccessL){
          case 10:
            newAccessL = 0;
            break;
          case 11:
            newAccessL = 1;
            break;
        }
        
    }
    if(newAccessL){
      try{
        await alterOne("Auth", "username", [["username", username], ["accessL", newAccessL]]);
        return {"error": false, "message": "Success"};
      }catch(error){
        return {"error": true, "message": "The user has not been suspended"};
      }
    }else{
      if(currentAccessL == 0 || currentAccessL == 1){
        return {"error": true, "message": "The user is already unblocked"};
      }
      return {"error": true, "message": "The user is already blocked"};
    }
  }else{
    return {"error": true, "message": "The user is not blockable"};
  }
}

const resolvers = {
   Query: {
    users: async () => {
      return await getAll("Users", undefined);
    },
    courses: async () => {
      return await getAll("Courses", undefined);
    } 
   },
   Mutation: {
    suspendUser: async (_, args) => {
      const {username} = args;
      return await switchStatus(username, true);
    },
    renewUser: async (_, args) => {
      const {username} = args;
      return await switchStatus(username, false);
    }
  }
}
export function launchGraphQL(port){
  const server = new ApolloServer({typeDefs: defs, resolvers});
  startStandaloneServer(server, {
      listen: {port: port}
  }).then(
      (result) => {
          console.log("GraphQL server is running on port "+port);
      }
  ).catch(
      (error) => {
          console.log("Error running GraphQL server");
      }
  )
}
