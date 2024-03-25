// Developers: Tamir Razon 207421322, Daniel Korkus 314629692
import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import ChooseReport from './ChooseReport.jsx';
import CostForm from './CostForm.jsx';
import Table from './Table.jsx';
import idb from '../idb.js';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";


function App() {
  // State variables
  const [costsRows, setCostRows] = useState([]); // State for cost rows
  const [db, setDb] = useState([]); // State for indexedDB instance
  const [isLoading, setIsLoading] = useState(true); // State to track loading state
  const [selectedDate, setSelectedDate] = useState(dayjs()); // State for selected date

  // useEffect hook to initialize indexedDB instance and fetch data
  useEffect(() => {
    // Open indexedDB and fetch data
    idb.openCostsDB("CostsDB", 1).then(request => {
      setDb(request); // Set indexedDB instance to state
      setIsLoading(false); // Set loading state to false
    }).catch(error => console.error("Error occurred: ", error)); // Log any errors
  }, []);

  // Render the App component
  return (<>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        {/* Application title */}
        <h4>Costs Manager</h4>
        <Container>
          {/* CostForm component for adding new costs */}
          <CostForm db={db} setCostRows={setCostRows} />
          {/* ChooseReport component for selecting report date range */}
          <ChooseReport db={db} setCostRows={setCostRows} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          {/* Table component for displaying costs data */}
          <Table db={db} costRows={costsRows} setCostRows={setCostRows} isLoading={isLoading} />
        </Container>
      </Container>
    </LocalizationProvider>
  </>
  );
}

export default App;
