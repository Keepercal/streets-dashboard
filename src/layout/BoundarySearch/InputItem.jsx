import findBoundaries from "../../services/nominatim";

function InputItem(){
    function handleSubmit(e){
        // Prevent browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form)

        // Turn form content into object
        const formJson = Object.fromEntries(formData.entries());
        const boundaryName = formJson.boundaryName

        const data = findBoundaries(boundaryName)

        console.log(data)
    }
    return(
        <form method="post" onSubmit={handleSubmit}>
            <input 
                className="input-item"
                name="boundaryName"
                placeholder="e.g. Lockleaze">
            </input>

            <button type="submit">Search</button>
        </form>

    )
}

export default InputItem;