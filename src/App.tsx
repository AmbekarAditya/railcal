import React, { useState } from 'react';
import MainTable from './components/MainTable';
import './App.css';

const App: React.FC = () => {
  const [selectedPayband, setSelectedPayband] = useState<number>(1);

  const paybandOptions = [1, 2, 3];

  return (
    <div className="App">
      <h1>Railway Allowance Calculator</h1>
      <div>
        <label htmlFor="payband">Select Payband:</label>
        <select
          id="payband"
          value={selectedPayband}
          onChange={(e) => setSelectedPayband(Number(e.target.value))}
        >
          {paybandOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <MainTable payband={selectedPayband} />
    </div>
  );
};

export default App;