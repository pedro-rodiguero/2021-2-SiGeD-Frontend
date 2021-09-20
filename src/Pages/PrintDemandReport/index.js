/* eslint-disable */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Main, H1 } from './Style';
const DemandReport = () => {
  const { id } = useParams();

  return (
    <Main>
      <H1>
        Divisão de Proteção à Saúde do Servidor
      </H1>

    </Main>

  );
};

export default DemandReport;
