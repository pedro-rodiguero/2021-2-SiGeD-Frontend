import React, { useRef } from 'react';

import {
  Container,
  Label,
  LabelContainer,
  Message,
} from './Style';

const UploadInput = ({
  label,
  fileName = '',
  disabled = false,
  ...rest
}) => {
  const inputRef = useRef(null);

  return (
    <Container>
      {label && <strong>{label}</strong>}

      <input
        type="file"
        id="general-file-input"
        ref={inputRef}
        disabled={disabled}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      <LabelContainer disabled={disabled}>
        <Label htmlFor="general-file-input" disabled={disabled}>

          <Message>{fileName || 'Escolher Arquivo'}</Message>

        </Label>
      </LabelContainer>
    </Container>
  );
};

export default UploadInput;
