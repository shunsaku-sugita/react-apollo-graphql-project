import { useState } from 'react';
import { v4 } from 'uuid';
import { Button, Form, Input, Select, Divider } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_CAR, GET_PEOPLE_WITH_CARS } from '../../graphql/queries';

export const AddCar = () => {
  const [id, setId] = useState(v4());
  const [form] = Form.useForm();
  const [addCar] = useMutation(ADD_CAR);
  const { loading, error, data } = useQuery(GET_PEOPLE_WITH_CARS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const onRegister = values => {
    const { year, make, model, price, personId } = values;

    addCar({
      variables: {
        AddCar: {
          id,
          year: parseInt(year),
          make,
          model,
          price: parseFloat(price),
          personId
        }
      },
      update: (cache, { data: { addCar } }) => {
        const existingData = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });

        const selectedPersonInCache = existingData.people.find(person => person.id === addCar.personId);

        const personWithNewCar = {
          ...selectedPersonInCache,
          cars: [...selectedPersonInCache.cars, addCar],
        };

        cache.writeQuery({
          query: GET_PEOPLE_WITH_CARS,
          data: {
            ...existingData,
            people: existingData.people.map(person =>
              person.id === addCar.personId ? personWithNewCar : person
            ),
          },
        });
      },
    });

    setId(v4());
  };

  return (
    data.people.length === 0 ? (
      <></>
    ) : (
      <>
        <Divider style={{ fontSize: "28px", fontWeight: "bold" }}> {"Add Car"} </Divider>
        <Form
          name="add-car"
          layout="inline"
          size="large"
          style={{ marginBottom: '40px', marginTop: '40px', justifyContent: 'center' }}
          form={form}
          onFinish={onRegister}
        >
          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: "Please enter car's year" }]}
          >
            <Input placeholder="Year" />
          </Form.Item>

          <Form.Item
            label="Make"
            name="make"
            rules={[{ required: true, message: "Please enter a maker's name" }]}
          >
            <Input placeholder="Make" />
          </Form.Item>

          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: "Please enter your car model" }]}
          >
            <Input placeholder="Model" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter your car's price" }]}
          >
            <Input placeholder="$" />
          </Form.Item>

          <Form.Item
            label="Person"
            name="personId"
            rules={[{ required: true, message: "Please select a owner" }]}
          >
            <Select
              options={loading || error ? [] : data.people.map(person => ({
                value: person.id,
                label: `${person.firstName} ${person.lastName}`,
              }))}
              placeholder="Select a person"
            />
          </Form.Item>

          <Form.Item shouldUpdate={true}>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                Add Car
              </Button>
            )}
          </Form.Item>
        </Form>
      </>
    )
  );
};
