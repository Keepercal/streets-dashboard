function InputItem({ 
    searchBoundaries,
    clearBoundaryResults,
    clearBoundary, 
    clearFeatures,
}){
    const handleSubmit = async(e) => {
        // Prevent browser from reloading the page
        e.preventDefault();

        // Read the form data
        const formData = new FormData(e.target);
        const boundaryName = formData.get("boundaryName");

        await searchBoundaries(boundaryName);
    }

    const handleReset = () => {
        clearBoundaryResults();
        clearBoundary();
        clearFeatures();
    }

    return(
        <form className="boundary-form"
            onSubmit={handleSubmit}
            onReset={handleReset}
        >
            <input 
                className="input-item"
                name="boundaryName"
                placeholder="e.g. Bristol"
                autoComplete="off"
            />
            
            <div className="button-row">
                <button className="btn btn-primary" type="submit">Search</button>
                <button className="btn btn-secondary" type="reset">Clear</button>
            </div>
        </form>
    )
}

export default InputItem;