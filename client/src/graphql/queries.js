import { gql } from '@apollo/client';

// Queries
export const GET_PEOPLE_WITH_CARS = gql`
  query {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        price
        make
        model
        personId
      }
    }
  }
`;

export const GET_PERSON_WITH_CARS = gql`
  query person($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
      cars {
        id
        year
        price
        make
        model
        personId
      }
    }
  }
`;

// Mutations
export const ADD_PERSON = gql`
  mutation AddPerson($AddPerson: AddPersonInput!) {
    addPerson(person: $AddPerson) {
      id
      firstName
      lastName
      cars {
        id
        year
        price
        make
        model
        personId
      }
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $UpdatePerson: UpdatePersonInput!) {
    updatePerson(id: $id, update: $UpdatePerson) {
      id
      firstName
      lastName
    }
  }
`;

export const ADD_CAR = gql`
  mutation AddCar($AddCar: AddCarInput!) {
    addCar(car: $AddCar) {
      id
      year
      price
      make
      model
      personId
    }
  }
`;

export const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar($id: ID!, $UpdateCar: UpdateCarInput!) {
    updateCar(id: $id, update: $UpdateCar) {
      id
      year
      price
      make
      model
      personId
    }
  }
`;
