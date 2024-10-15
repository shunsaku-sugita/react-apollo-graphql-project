import { useState } from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { DELETE_CAR, GET_PEOPLE_WITH_CARS } from "../../graphql/queries";
import filter from "lodash.filter";
import { UpdateCar } from "./UpdateCar";

export const CarDetail = (props) => {
  const [updateCar, setUpdateCar] = useState(false);
  const { id, year, make, model, price, personId } = props;

  const convertToUSD = (price) => {
    const formatter = new Intl.NumberFormat(
      "en-US",
      { style: "currency", currency: "USD", }
    );
    return formatter.format(price);
  };

  const handleClickUpdateButton = () => {
    setUpdateCar(!updateCar);
  };

  const DeleteCar = () => {
    const [deleteCar] = useMutation(DELETE_CAR, {
      update(cache, { data: { deleteCar } }) {
        const { people } = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });

        const filteredPeople = people.map((person) => {
          if (person.id === deleteCar.personId) {
            return {
              ...person,
              cars: filter(person.cars, (car) => car.id !== deleteCar.id),
            };
          }
          return person;
        });

        cache.writeQuery({
          query: GET_PEOPLE_WITH_CARS,
          data: { people: filteredPeople },
        });
      },
    });

    const handleClickDeleteButton = () => {
      const confirmDelete = window.confirm(
        "Do you really want to delete this car?"
      );
      if (confirmDelete) {
        deleteCar({ variables: { id } });
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
      {updateCar ? (
        <UpdateCar
          id={id}
          year={year}
          make={make}
          model={model}
          price={price}
          personId={personId}
          onButtonClick={handleClickUpdateButton}
        />
      ) : (
        <Card
          style={{ backgroundColor: "lightgrey", margin: "16px" }}
          key={props.index}
          type="inner"
          actions={[
            <EditOutlined key="edit" onClick={handleClickUpdateButton} />,
            <DeleteCar />,
          ]}
        >
          {`${year} ${make} ${model} -> ${convertToUSD(price)}`}
        </Card>
      )}
    </div>
  );
};
