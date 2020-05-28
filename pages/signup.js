import Signup from "../components/Signup";
import Signin from "../components/Signin";
import Requestreset from "../components/Requestreset";
import styled from "styled-components";

const Colums = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SingupPage = (props) => (
  <Colums>
    <Signup />
    <Signin />
    <Requestreset />
  </Colums>
);

export default SingupPage;
