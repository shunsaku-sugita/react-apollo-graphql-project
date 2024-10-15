import { useState } from 'react';
import { v4 } from 'uuid';
import { Button, Form, Input, Divider } from 'antd';
import { useMutation } from '@apollo/client';
import { ADD_PERSON, GET_PEOPLE_WITH_CARS } from '../../graphql/queries';

export const AddPerson = () => {
  const [id, setId] = useState(v4());
  const [form] = Form.useForm();
  const [addPerson] = useMutation(ADD_PERSON);

  const onRegister = values => {
    const { firstName, lastName } = values;

    addPerson({
      variables: {
        AddPerson: {
          id,
          firstName,
          lastName,
          cars: []
        }
      },
      update: (cache, { data: { addPerson } }) => {
        const existingData = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });
        cache.writeQuery({
          query: GET_PEOPLE_WITH_CARS,
          data: {
            ...existingData,
            people: [...existingData.people, addPerson]
          }
        });
      }
    });

    setId(v4());
  };

  return (
    <>
      <Divider style={{ fontSize: "28px", fontWeight: "bold" }}> {"Add Person"} </Divider>
      <Form
        name="add-person"
        layout="inline"
        size="large"
        style={{ marginBottom: '40px', marginTop: '40px', justifyContent: 'center' }}
        form={form}
        onFinish={onRegister}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>

        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) || form.getFieldsError().filter(({ errors }) => errors.length).length
              }
            >
              Add Person
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};
