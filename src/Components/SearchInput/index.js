import React from 'react';
import styles from './Style';

const SearchInput = ({
  type,
  icon,
  setWord,
  title,
  placeholder = 'Pesquisar...',
}) => (
  <div style={styles.search}>
    <div style={styles.icon}>
      {icon}
    </div>
    <input
      title={title}
      type={type}
      placeholder={placeholder}
      style={styles.generic}
      onChange={(word) => setWord(word.target.value)} />
  </div>
);

export default SearchInput;
