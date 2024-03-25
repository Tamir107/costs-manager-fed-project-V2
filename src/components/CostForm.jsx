// Developers: Tamir Razon 207421322, Daniel Korkus 314629692
import { useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import "../App.css";
import InputAdornment from '@mui/material/InputAdornment';

function CostForm({ db = {}, setCostRows }) {
    // State variables for sum, category, and description
    const [sum, setSum] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    // Function to handle adding a new cost
    const handleAddCost = async (event) => {
        try {
            // Create a new cost item object
            const costItem = { "sum": sum, "category": category, "description": description };
            // Add the cost item to the database
            await db.addCost(costItem);
            // Fetch updated cost data from the database
            const costRows = await db.getCosts();
            // Update cost rows state with the fetched data
            setCostRows(costRows);

            event.preventDefault(); // Prevent default form submission behavior
        } catch (error) {
            console.error("Error occurred while adding the data: ", error); // Log any errors that occur
        }
    }

    // Render the CostForm component
    return (
        <>
            <form onSubmit={handleAddCost}>
                <div id="container">
                    <div className="input-group">
                        {/* Input field for sum */}
                        <TextField
                            required
                            id="sum"
                            label="Sum"
                            type="number"
                            value={sum}
                            onChange={(e) => setSum(e.target.value)}
                            size="normal"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                            }}
                        />
                        {/* Dropdown menu for category selection */}
                        <TextField
                            id="category"
                            required
                            select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Select Category"
                            size="normal"
                        >
                            <MenuItem value="">--Please choose a category--</MenuItem>
                            <MenuItem value="FOOD">FOOD</MenuItem>
                            <MenuItem value="HEALTH">HEALTH</MenuItem>
                            <MenuItem value="EDUCATION">EDUCATION</MenuItem>
                            <MenuItem value="TRAVEL">TRAVEL</MenuItem>
                            <MenuItem value="HOUSING">HOUSING</MenuItem>
                            <MenuItem value="OTHER">OTHER</MenuItem>
                        </TextField>

                        {/* Input field for description */}
                        <TextField
                            id="description"
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            size="normal"
                            sx={{ width: "25%" }}
                        />
                    </div>
                    {/* Submit button */}
                    <Button variant="contained" type="submit">Submit</Button>
                </div>
            </form>
        </>

    );
}

export default CostForm;
