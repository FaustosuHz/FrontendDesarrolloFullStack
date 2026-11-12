import { Outlet } from "react-router-dom";
import Menu from "./components/Menu.jsx";

const App = () => {
  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};

export default App;
