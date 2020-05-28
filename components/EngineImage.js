import React from "react";

import styled from "styled-components";

const CenterDiv = styled.div`
  img {
    margin: 50px auto;
    display: block;
    max-width: 90%;
  }
`;

const EngineImage = (props) => {
  return (
    <CenterDiv>
      <img src="../static/engine_exploded.png"></img>
    </CenterDiv>
  );
};

export default EngineImage;
