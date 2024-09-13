import React from 'react';

const Table = ({ data, columns, lastRowRef, columnMapping }) => {
  console.log("Rendering Table with Data:", data);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{columnMapping[column]}</th> // Use display names
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} ref={index === data.length - 1 ? lastRowRef : null}>
              {columns.map((column) => {
                const cellData = column === 'sr_no' ? index + 1 : row[column]; // Calculate Sr. No
                console.log(`Row ${index}, Column ${column}:`, cellData);
                return <td key={column}>{cellData}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;