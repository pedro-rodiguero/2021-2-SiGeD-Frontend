import React from 'react';
import { DropdownDiv, TextLabel, DateInput } from '../Style';

export default function Dropdown({
  initialDate, setInitialDate, finalDate, setFinalDate,
}) {
  return (
    <>
      <DropdownDiv style={{ width: '40%' }}>
        <TextLabel>
          Data de Inicio:
        </TextLabel>
        <DateInput
          type="date"
          value={initialDate}
          onChange={(e) => setInitialDate(e.target.value)}
        />
      </DropdownDiv>
      <DropdownDiv style={{ width: '40' }}>
        <TextLabel>
          Data final:
        </TextLabel>
        <DateInput
          type="date"
          value={finalDate}
          onChange={(e) => setFinalDate(e.target.value)}
        />
      </DropdownDiv>
    </>
  );
}
