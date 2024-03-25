// Developers: Tamir Razon 207421322, Daniel Korkus 314629692   
import React from 'react';
import { Button } from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function ChooseReport({ db = {}, setCostRows, selectedDate, setSelectedDate }) {

    // Function to handle generation of monthly report
    const handleMonthly = async () => {
        try {
            const date = dayjs.unix(selectedDate / 1000); // Convert selectedDate to Day.js object
            const month = date.month() + 1;// Extract month from the date
            const year = date.year();// Extract year from the date

            // Log year and month to console
            console.log("year is:" + year);
            console.log("month is:" + month);

            // Fetch costs data for the specified month and year from the database
            const costsData = await db.getCosts(month, year);
            // Update cost rows with the fetched data
            setCostRows(costsData);
        } catch (error) {
            console.error("Error occurred while reading the data: ", error); // Log any errors that occur
        }
    };

    // Function to handle generation of yearly report
    const handleYearly = async () => {
        try {
            const date = dayjs.unix(selectedDate / 1000); // Convert selectedDate to Day.js object
            const year = date.year(); // Extract year from the date

            // Fetch costs data for the specified year from the database
            const costsData = await db.getCosts(null, year);
            // Update cost rows with the fetched data
            setCostRows(costsData);
        } catch (error) {
            console.error("Error occurred while reading the data: ", error); // Log any errors that occur
        }
    };

    return (
        <div className="section">
            <div id="container-date">
                {/* Date picker component */}
                <DatePicker
                    sx={{ width: "25%" }} // Apply inline styles for width
                    slotProps={{ textField: { size: "normal" } }} // Set properties for the input field
                    views={["month", "year"]} // Limit the DatePicker view to months and years only
                    value={selectedDate} // Bind the value to the selectedDate state
                    onChange={date => setSelectedDate(date)} // Set state when selected date
                    disableFuture // Disable selection of future dates
                />
                {/* Button to trigger generation of monthly report */}
                <Button variant="contained" onClick={handleMonthly}>Monthly Report</Button>
                {/* Button to trigger generation of yearly report */}
                <Button variant="contained" onClick={handleYearly}>Yearly Report</Button>
            </div>
        </div>
    );
};

export default ChooseReport;
