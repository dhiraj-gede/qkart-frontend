import Register from "./components/Register";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks"

export const config = {
  endpoint: `https://elbonn99-qkart-backend.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      <Switch>
        <Route path="/checkout" component={Checkout} />
        <Route path="/thanks" component={Thanks} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Products} />
      </Switch>
    </div>
  );
}

export default App;
