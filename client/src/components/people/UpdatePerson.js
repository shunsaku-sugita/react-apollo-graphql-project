import { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_PERSON, GET_PEOPLE_WITH_CARS } from '../../graphql/queries';

export const UpdatePerson = ({ id, firstName, lastName, onButtonClick }) => {
  const [form] = Form.useForm();
  const [, triggerRerender] = useState();
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    update: (cache, { data: { updatePerson } }) => {
      const { people } = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });
      const updatedPeople = people.map(person =>
        person.id === id
          ? { ...person, firstName: updatePerson.firstName, lastName: updatePerson.lastName }
          : person
      );

      cache.writeQuery({
        query: GET_PEOPLE_WITH_CARS,
        data: { people: updatedPeople },
      });
    },
  });

  const handleSubmit = values => {
    const { firstName, lastName } = values;

    updatePerson({
      variables: {
        id,
        UpdatePerson: { firstName, lastName },
      },
    }).then(() => {
      onButtonClick();
    });
  };

  useEffect(() => {
    triggerRerender();
  }, []);

  return (
    <Form
      name="update-person-form"
      layout="inline"
      style={{ marginBottom: '40px', marginTop: '40px', justifyContent: 'center' }}
      onFinish={handleSubmit}
      initialValues={{ firstName, lastName }}
      form={form}
    >
      <Form.Item
        name="firstName"
        rules={[{ required: true, message: 'Please enter a first name.' }]}
      >
        <Input placeholder="First Name" />
      </Form.Item>

      <Form.Item
        name="lastName"
        rules={[{ required: true, message: 'Please enter a last name.' }]}
      >
        <Input placeholder="Last Name" />
      </Form.Item>

      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched() || form.getFieldsError().some(({ errors }) => errors.length)
            }
          >
            Update
          </Button>
        )}
      </Form.Item>

      <Button onClick={onButtonClick}>Cancel</Button>
    </Form>
  );
};
