import React from 'react';
import Table from './Table';
import './FilterableTable.css';

const FilterableTable = ({ data, columns, lastRowRef, handleFilterChange, columnMapping }) => {
  return (
    <div className="filterable-table">
      <div className="filters">
        {columns.map((column) => (
          <div key={column} className="filter-input">
            <label htmlFor={column}>{`Filter by ${columnMapping[column]}`}</label>
            <input
              type="text"
              id={column}
              name={column}
              placeholder={`Filter by ${columnMapping[column]}`}
              onChange={(e) => handleFilterChange(e, column)}
              autoComplete="on"
            />
          </div>
        ))}
      </div>
      <Table data={data} columns={columns} lastRowRef={lastRowRef} columnMapping={columnMapping} />
    </div>
  );
};

export default FilterableTable;