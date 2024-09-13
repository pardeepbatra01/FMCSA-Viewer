import React, { useState, useEffect, useRef, useCallback } from 'react';
import FilterableTable from './components/FilterableTable';
import PivotTableComponent from './components/PivotTableComponent';
import ScrollToTopButton from './components/ScrollToTopButton';
import './App.css';

const columnMapping = {
  sr_no: 'Sr. No',
  created_dt: 'Created_DT',
  data_source_modified_dt: 'Modifed_DT',
  entity_type: 'Entity',
  operating_status: 'Operating status',
  legal_name: 'Legal name',
  dba_name: 'DBA name',
  physical_address: 'Physical address',
  phone: 'Phone',
  usdot_number: 'DOT',
  mc_mx_ff_number: 'MC/MX/FF',
  power_units: 'Power units',
  out_of_service_date: 'Out of service date',
};

const columns = Object.keys(columnMapping);

const PAGE_SIZE = 100;

function App() {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [view, setView] = useState('pivot');
  const observer = useRef();

  useEffect(() => {
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    worker.postMessage({});
    worker.onmessage = (e) => {
      if (e.data.error) {
        console.error("Error parsing file:", e.data.error);
        setLoading(false);
      } else {
        const { progress, data: chunk } = e.data;
        setProgress(progress);
        setData((prevData) => {
          const newData = [...prevData, ...chunk];
          return [...new Set(newData.map((item) => JSON.stringify(item)))].map((item) =>
            JSON.parse(item)
          );
        });
        setFilteredData((prevData) => [...prevData, ...chunk]);
        setVisibleData((prevData) => [...prevData, ...chunk].slice(0, PAGE_SIZE));
        if (progress === 100) {
          setLoading(false);
        }
      }
    };
    return () => worker.terminate();
  }, []);

  const loadMoreData = useCallback(() => {
    if (loadingMore || visibleData.length >= filteredData.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newVisibleData = filteredData.slice(0, nextPage * PAGE_SIZE);
      setVisibleData(newVisibleData);
      setPage(nextPage);
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore, visibleData.length, filteredData, page]);

  const lastRowRef = useCallback(
    (node) => {
      if (loadingMore || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, loading, loadMoreData]
  );

  const handleFilterChange = (e, column) => {
    const newFilters = { ...filters, [column]: e.target.value };
    setFilters(newFilters);
    const filtered = data.filter((row) =>
      Object.keys(newFilters).every((key) =>
        row[key]?.toString().toLowerCase().includes(newFilters[key]?.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setVisibleData(filtered.slice(0, page * PAGE_SIZE));
  };

  return (
    <div className="App">
      <button onClick={() => setView(view === 'table' ? 'pivot' : 'table')}>
        {view === 'table' ? 'Switch to Pivot Table' : 'Switch to Table View'}
      </button>
      {loading ? (
        <p>Loading data... {Math.min(progress, 100).toFixed(2)}%</p>
      ) : (
        <>
          {view === 'table' ? (
            <>
              <FilterableTable
                data={visibleData}
                columns={columns}
                lastRowRef={lastRowRef}
                handleFilterChange={handleFilterChange}
                columnMapping={columnMapping}
              />
              <ScrollToTopButton />
            </>
          ) : (
            <PivotTableComponent data={data} columns={columns} filters={filters} />
          )}
        </>
      )}
      {loadingMore && <p>Loading more data...</p>}
    </div>
  );
}

export default App;
