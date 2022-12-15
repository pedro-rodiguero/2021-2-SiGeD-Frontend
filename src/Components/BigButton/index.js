import React from 'react';
import styles from './Style';

const BigButton = ({
  title, type, changeButton, disabled,
}) => (
  <div>
    <button
      disabled={disabled}
      style={styles[type]}
      onClick={() => changeButton()}>
      {title}
    </button>
  </div>
);

export default BigButton;
