import { List, Spin, Divider } from "antd";
import { useQuery } from "@apollo/client";
import { GET_PEOPLE_WITH_CARS } from "../graphql/queries";
import { PersonDetail } from "./people/PersonDetail";

export const Records = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE_WITH_CARS);

  if (loading) return <Spin size="large" />;
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <Divider style={{ fontSize: "28px", fontWeight: "bold" }}> {"Records"} </Divider>
      <List grid={{ gutter: 90, column: 1 }}>
        {data.people.map(({ id, firstName, lastName, cars }) => (
          <List.Item key={id}>
            <PersonDetail
              id={id}
              firstName={firstName}
              lastName={lastName}
              cars={cars}
            />
          </List.Item>
        ))}
      </List>
    </div>
  );
}
