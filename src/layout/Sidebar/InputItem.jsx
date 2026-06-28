function InputItem({ searchBoundaries, clearBoundary }){
    const handleSubmit = async(e) => {
        // Prevent browser from reloading the page
        e.preventDefault();

        // Read the form data
        const formData = new FormData(e.target);
        const boundaryName = formData.get("boundaryName");

        await searchBoundaries(boundaryName);
    }

    const handleReset = () => {
        clearBoundary();
    }

    return(
        <form method="post" 
            onSubmit={handleSubmit}
            onReset={handleReset}
        >
            <input 
                className="input-item"
                name="boundaryName"
                placeholder="e.g. Bristol"
            />

            <button type="submit">Search</button>
            <button type="reset">Clear</button>
        </form>

    )
}

export default InputItem;