import { useState } from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_PEOPLE_WITH_CARS, DELETE_PERSON } from "../../graphql/queries";
import filter from "lodash.filter";

import { UpdatePerson } from "./UpdatePerson";
import { CarDetail } from "../car/CarDetail";

export const PersonDetail = ({ id, firstName, lastName, cars }) => {
  const [updatePerson, setUpdatePerson] = useState(false);

  const handleClickUpdateButton = () => {
    setUpdatePerson(!updatePerson);
  };

  const DeletePerson = () => {
    const [deletePerson] = useMutation(DELETE_PERSON, {
      update(cache, { data: { deletePerson } }) {
        const { people } = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });
        cache.writeQuery({
          query: GET_PEOPLE_WITH_CARS,
          data: {
            people: filter(people, (person) => person.id !== deletePerson.id),
          },
        });
      },
    });

    const handleClickDeleteButton = () => {
      const confirmDelete = window.confirm(
        "Do you really want to delete this person?"
      );
      if (confirmDelete) {
        deletePerson({ variables: { id } });
      }
    };

    return (
      <DeleteOutlined
        key="delete"
        style={{ color: "red" }}
        onClick={handleClickDeleteButton}
      />
    );
  };

  return (
    <div>
      {updatePerson ? (
        <UpdatePerson
          id={id}
          firstName={firstName}
          lastName={lastName}
          cars={cars}
          onButtonClick={handleClickUpdateButton}
        />
      ) : (
        <Card
          style={{
            textAlign: "left",
            fontSize: "20px",
            margin: "24px",
            borderRadius: "0px",
            border: "1px solid grey",
          }}
          title={`${firstName} ${lastName}`}
          actions={[
            <EditOutlined key="edit" onClick={handleClickUpdateButton} />,
            <DeletePerson />,
          ]}
        >
          {cars.map((car, index) => (
            <CarDetail key={index} {...car} />
          ))}
          <Link to={`/person/${id}`} style={{ fontSize: "16px" }}>
            Learn More
          </Link>
        </Card>
      )}
    </div>
  );
};
