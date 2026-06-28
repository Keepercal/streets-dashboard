function InputItem({ searchBoundaries }){
    const handleSubmit = async(e) => {
        // Prevent browser from reloading the page
        e.preventDefault();

        // Read the form data
        const formData = new FormData(e.target);
        const boundaryName = formData.get("boundaryName");

        await searchBoundaries(boundaryName);
    }
    return(
        <form method="post" onSubmit={handleSubmit}>
            <input 
                className="input-item"
                name="boundaryName"
                placeholder="e.g. Lockleaze"
            />

            <button type="submit">Search</button>
        </form>

    )
}

export default InputItem;