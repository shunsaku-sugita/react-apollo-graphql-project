import { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Spin, Divider } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_CAR, GET_PEOPLE_WITH_CARS } from '../../graphql/queries';

export const UpdateCar = ({ id, year, make, model, price, personId, onButtonClick }) => {
  const [form] = Form.useForm();
  const [, triggerRerender] = useState();
  const { loading, error, data } = useQuery(GET_PEOPLE_WITH_CARS);

  const [updateCar] = useMutation(UPDATE_CAR, {
    update: (cache, { data: { updateCar } }) => {
      const existingData = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });

      if (!existingData || !existingData.people) {
        console.error("No people data found in the cache.");
        return;
      }

      const previousOwner = existingData.people.find(person => person.id === personId);
      if (previousOwner) {
        const updatedPreviousOwner = {
          ...previousOwner,
          cars: previousOwner.cars.filter(car => car.id !== updateCar.id),
        };

        cache.writeQuery({
          query: GET_PEOPLE_WITH_CARS,
          data: {
            ...existingData,
            people: existingData.people.map(person =>
              person.id === previousOwner.id ? updatedPreviousOwner : person
            ),
          },
        });
      }

      const newOwner = existingData.people.find(person => person.id === updateCar.personId);
      if (newOwner) {
        const updatedNewOwner = {
          ...newOwner,
          cars: [...newOwner.cars.filter(car => car.id !== updateCar.id), updateCar],
        };

        cache.writeQuery({
          query: GET_PEOPLE_WITH_CARS,
          data: {
            ...existingData,
            people: existingData.people.map(person =>
              person.id === newOwner.id ? updatedNewOwner : person
            ),
          },
        });
      }
    },
  });

  const handleSubmit = (values) => {
    const { year, make, model, personId } = values;
    const price = parseFloat(values.price);

    if (isNaN(price)) {
      console.error('Price is not a valid number');
      return;
    }

    updateCar({
      variables: {
        id,
        UpdateCar: {
          year: parseInt(year),
          make,
          model,
          price,
          personId,
        },
      },
    }).then(() => {
      onButtonClick();
    });
  };

  useEffect(() => {
    triggerRerender();
  }, []);

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Divider />
      <Form
        name="update-car-form"
        layout="inline"
        onFinish={handleSubmit}
        initialValues={{
          year: String(year),
          make,
          model,
          price: String(price),
          personId,
        }}
        form={form}
        style={{ gap: '16px' }}
      >
        <Form.Item
          name="year"
          rules={[{ required: true, message: 'Please enter the car year.' }]}
        >
          <Input placeholder="Year" />
        </Form.Item>

        <Form.Item
          name="make"
          rules={[{ required: true, message: 'Please enter the car make.' }]}
        >
          <Input placeholder="Make" />
        </Form.Item>

        <Form.Item
          name="model"
          rules={[{ required: true, message: 'Please enter the car model.' }]}
        >
          <Input placeholder="Model" />
        </Form.Item>

        <Form.Item
          name="price"
          rules={[{ required: true, message: 'Please enter the car price.' }]}
        >
          <Input placeholder="Price" />
        </Form.Item>

        <Form.Item
          name="personId"
          rules={[{ required: true, message: 'Please select the car owner.' }]}
        >
          <Select
            placeholder="Select Owner"
            options={data.people.map(person => ({
              value: person.id,
              label: `${person.firstName} ${person.lastName}`,
            }))}
          />
        </Form.Item>

        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched() ||
                form.getFieldsError().some(({ errors }) => errors.length)
              }
            >
              Update
            </Button>
          )}
        </Form.Item>

        <Button onClick={onButtonClick}>Cancel</Button>
      </Form>
      <Divider />
    </>
  );
};
