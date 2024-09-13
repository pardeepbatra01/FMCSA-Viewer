import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import moment from 'moment';

class PivotTableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pivotState: {
        data: this.filterData(props.data, props.filters, props.columns),
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data !== this.props.data ||
      prevProps.filters !== this.props.filters ||
      prevProps.columns !== this.props.columns
    ) {
      this.setState({
        pivotState: {
          ...this.state.pivotState,
          data: this.filterData(this.props.data, this.props.filters, this.props.columns),
        },
      });
    }
  }

  filterData(data, filters, columns) {
    const filteredColumns = columns.filter(col => col !== 'sr_no');
    return data
      .filter((row) =>
        Object.keys(filters).every((key) =>
          row[key]?.toString().toLowerCase().includes(filters[key]?.toLowerCase())
        )
      )
      .map((row) => {
        const filteredRow = {};
        filteredColumns.forEach((col) => {
          if (col.includes('date') || col.includes('dt')) {
            filteredRow[`${col}_year`] = moment(row[col]).format('YYYY');
            filteredRow[`${col}_month`] = moment(row[col]).format('MMMM');
            filteredRow[`${col}_week`] = moment(row[col]).format('WW');
          }
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });
  }

  render() {
    return (
      <PivotTableUI
        data={this.state.pivotState.data}
        onChange={(s) => this.setState({ pivotState: s })}
        {...this.state.pivotState}
      />
    );
  }
}

export default PivotTableComponent;
