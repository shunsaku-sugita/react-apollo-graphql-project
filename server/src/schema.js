import { people, cars } from '../peopleCarsScheme';
import find from 'lodash.find';
import remove from 'lodash.remove';

const findById = (array, id) => find(array, { id });

const findOrThrow = (array, id, entity) => {
  const entityFound = findById(array, id);
  if (!entityFound) {
    throw new Error(`Couldn't find ${entity} with id ${id}`);
  }
  return entityFound;
};

export const typeDefs = `#graphql
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car!]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: ID!): Person
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(person: AddPersonInput!): Person
    updatePerson(id: ID!, update: UpdatePersonInput!): Person
    deletePerson(id: ID!): Person
    
    addCar(car: AddCarInput!): Car
    updateCar(id: ID!, update: UpdateCarInput!): Car
    deleteCar(id: ID!): Car
  }

  input AddPersonInput {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [AddCarInput]
  }

  input AddCarInput {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  input UpdatePersonInput {
    firstName: String!
    lastName: String!
  }

  input UpdateCarInput {
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }
`;

export const resolvers = {
  Query: {
    people: () => people,
    person: (root, { id }) => findById(people, id),
    cars: () => cars,
    car: (root, { id }) => findById(cars, id),
  },

  Person: {
    cars: (parent) => cars.filter((car) => car.personId === parent.id),
  },

  Mutation: {
    addPerson: (root, { person }) => {
      const newPerson = {
        ...person,
        cars: [],
      };
      people.push(newPerson);
      return newPerson;
    },

    updatePerson: (root, { id, update }) => {
      const person = findOrThrow(people, id, 'person');
      Object.assign(person, update);
      return person;
    },

    deletePerson: (root, { id }) => {
      const personToRemove = findOrThrow(people, id, 'person');
      cars.forEach((car) => {
        if (car.personId === personToRemove.id) {
          remove(cars, { id: car.id });
        }
      });

      remove(people, { id: personToRemove.id });
      return personToRemove;
    },

    addCar: (root, { car }) => {
      const newCar = {
        ...car,
      };
      cars.push(newCar);
      return newCar;
    },

    updateCar: (root, { id, update }) => {
      const car = findOrThrow(cars, id, 'car');
      Object.assign(car, update);
      return car;
    },

    deleteCar: (root, { id }) => {
      const carToRemove = findOrThrow(cars, id, 'car');
      remove(cars, { id: carToRemove.id });
      return carToRemove;
    },
  },
};
