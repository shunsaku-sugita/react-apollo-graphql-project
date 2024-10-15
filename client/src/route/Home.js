import { Title } from '../components/layout/Title';
import { AddPerson } from '../components/people/AddPerson';
import { AddCar } from '../components/car/AddCar';
import { Records } from '../components/Records';
import { Divider } from 'antd';

// Home component
export const Home = () => {
  return (
    <div className="App">
      <Title />
      <Divider style={{ fontSize: "32px" }}></Divider>
      <AddPerson />
      <AddCar />
      <Records />
    </div>
  )
}
