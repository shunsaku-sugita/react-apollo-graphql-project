import { useQuery } from "@apollo/client";
import { GET_PERSON_WITH_CARS } from "../graphql/queries";
import { Link, useParams } from "react-router-dom";
import { Card, Space, Spin } from "antd";

const formatPriceToUSD = (price) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(price);
};


export const Person = () => {
  const { personId } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id: personId },
  });

  if (loading) return <Spin size="large" />;
  if (error) return <p>Error: {error.message}</p>;

  const person = data?.person;

  return (
    <div>
      {person && (
        <Card style={{ fontSize: '30px', margin: '50px', borderRadius: '0px', border: '1px solid grey' }}>
          {`${person.firstName} ${person.lastName}'s cars`}
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {person.cars.length > 0 ? (
              person.cars.map((car) => (
                <Card
                  key={car.id}
                  type="inner"
                  title={`${car.year} ${car.make} ${car.model}`}
                >
                  {formatPriceToUSD(car.price)}
                </Card>
              ))
            ) : (
              <p>{`${person.firstName} ${person.lastName} does not have any cars. Let's add some!`}</p>
            )}
            <Link to={`/`} style={{ fontSize: '16px' }}>Go Back Home</Link>
          </Space>
        </Card>
      )}
    </div>
  );
};
