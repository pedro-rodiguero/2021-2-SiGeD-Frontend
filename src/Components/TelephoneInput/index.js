import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Container, Label } from '../RegisterInput/Style';
import { ErrorMessage } from '../ErrorMessage';

const TelephoneInput = ({
  type,
  title,
  setText,
  value,
  long,
}) => {
  const [currentMask, setCurrentMask] = useState('(99) 99999-9999');
  const [currentPhone, setCurrentPhone] = useState('');

  const handleOnBlur = () => {
    if (currentPhone.length === 14) setCurrentMask('(99) 9999-9999');
    setText(currentPhone);
  };

  const handleOnFocus = () => {
    setCurrentMask('(99) 99999-9999');
  };

  useEffect(() => {
    if (value) setCurrentPhone(value);
  }, [value]);

  return (
    <Container long={long}>
      <Label>
        {title}
        :
      </Label>
      <InputMask
        type={type}
        mask={currentMask}
        maskChar={null}
        value={currentPhone}
        onChange={(e) => setCurrentPhone(e.target.value)}
        placeholder={title}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
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
};

export default TelephoneInput;
