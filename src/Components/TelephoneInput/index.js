import React from 'react';
import InputMask from 'react-input-mask';
import { Container, Label } from '../RegisterInput/Style';
import { ErrorMessage } from '../ErrorMessage';

const TelephoneInput = ({
  type,
  title,
  setText,
  value,
  long,
}) => (
  <Container long={long}>
    <Label>
      {title}
      :
    </Label>
    <InputMask
      type={type}
      mask="(99) 99999-9999"
      maskChar={null}
      value={value}
      onChange={(e) => setText(e.target.value)}
      placeholder={title}
      style={{
        width: '100%',
        height: '40%',
        display: 'flex',
        border: '2px solid #000000',
        borderRadius: '9px',
        fontSize: '100%',
        textIndent: '10px',
        boxSizing: 'border-box',
        outline: '0',
      }}
    />
    <ErrorMessage input={value} title={title} />
  </Container>
);
export default TelephoneInput;
