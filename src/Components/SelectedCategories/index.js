import React from 'react';
import {
  SelectedBox, Tag, Word,
} from './Style';

const SelectedCategories = ({ selectedCategories, removeCategory }) => {
  const renderSelectedCategories = () => {
    if (selectedCategories?.length === 0) {
      return <Word style={{ marginTop: '10px' }}>Ainda não há categorias selecionadas...</Word>;
    }
    return selectedCategories?.map((selectedCategory, index) => (
      <Tag
        style={{ backgroundColor: selectedCategory.color, marginTop: [0, 1].includes(index) && '10px' }}
        key={selectedCategory._id}
        onClick={() => removeCategory(selectedCategory)}
      >
        {selectedCategory.name}
      </Tag>
    ));
  };

  return (
    <SelectedBox>
      {renderSelectedCategories()}
    </SelectedBox>
  );
};

export default SelectedCategories;
