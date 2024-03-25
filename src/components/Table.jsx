// Developers: Tamir Razon 207421322, Daniel Korkus 314629692
import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const Table = ({ isLoading, db = {}, costRows, setCostRows }) => {
    // useEffect hook to fetch costs data when isLoading changes
    useEffect(() => {
        if (isLoading) {
            return;
        } else {
            // Fetch costs data from the database
            db.getCosts().then((result) => setCostRows(result))
                .catch(error => console.error("Error occurred while fetching the data: ", error));
        }
    }, [db, isLoading]);

    // Function to handle deletion of a row
    const handleDeleteClick = (id) => {
        // Remove cost data with specified id from the database
        db.removeCosts(id)
            .then(() => db.getCosts())
            .then((result) => setCostRows(result))
            .catch(error => console.error("Error occurred while deleting the data: ", error));
    };

    // Columns configuration for the DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'sum', headerName: 'Sum', width: 130, headerAlign: 'center' },
        { field: 'category', headerName: 'Category', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'description', headerName: 'Description', width: 400, headerAlign: 'center' },
        {
            field: 'date', headerName: 'Date', width: 150,
            valueGetter: (params) => `${params.row.day}/${params.row.month}/${params.row.year}`, // Format date
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'delete',
            width: 73,
            headerName: 'Delete',
            align: 'center',
            headerAlign: 'center',
            // Render delete icon for each row
            renderCell: (params) => (
                <DeleteOutlinedIcon onClick={() => handleDeleteClick(params.row.id)} />
            ),
        },
    ];

    // Render the DataGrid component
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                sx={{
                    '.MuiDataGrid-columnHeaderTitle': { // Styling the table headers
                        fontWeight: 'bold !important',
                        textDecoration: 'underline',
                    }
                }}
                rows={costRows}
                columns={columns}
                pageSize={5}
                showCellVerticalBorder //Table borders
                showColumnVerticalBorder
                GridAlignment='center' //Header alignment
            />
        </div>
    );
};

export default Table;
