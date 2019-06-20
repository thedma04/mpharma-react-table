import React, { PureComponent, createContext } from 'react';
import PropTypes from 'prop-types';
import { tableSort, getSortingFn } from '../utils';

const DataContext = createContext(null);
export const withDataContext = Component => {
  return props => {
    return <DataContext.Consumer>{context => <Component {...props} context={context} />}</DataContext.Consumer>;
  };
};

// get the array of data indexes that map to the data prop
export function extractDataIndexes (headers) {
  const dataIndexes = [];
  headers.forEach(header => {
    if (header.dataIndex) {
      dataIndexes.push({ dataIndex: header.dataIndex, align: header.align, style: header.style });
    }
  });
  return dataIndexes;
}

class DataStore extends PureComponent {
  state = {
    data: [],
    dataIndexes: [],
    desc: false,
    active: null,
    rowsPerPageOptions: [],
    rowsPerPage: 0,
    currentPage: 0,
    count: 0
  };

  sortData = key => {
    const { data, desc } = this.state;
    this.setState({ data: tableSort(data, getSortingFn(desc, key)) }, () =>
      this.setState({ desc: !desc, active: key })
    );
  };

  loadData = data => {
    this.setState({ ...data });
  };

  setCurrentPage = page => {
    this.setState({ currentPage: page });
  };

  setRowsPerPage = rows => {
    this.setState({ rowsPerPage: rows });
  };

  get value () {
    return {
      ...this.state,
      sortData: this.sortData,
      loadData: this.loadData,
      setCurrentPage: this.setCurrentPage,
      setRowsPerPage: this.setRowsPerPage
    };
  }

  render () {
    console.log('state', this.state);
    return <DataContext.Provider value={this.value}>{this.props.children}</DataContext.Provider>;
  }
}

DataStore.propTypes = {
  children: PropTypes.node
};

export default DataStore;
