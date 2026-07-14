import "./DeleteButton.css"
import { Trash2 } from "lucide-react"

export default function DeleteButton({
    handleClearBoundary,
    disabled = false
}){
    return(
        <button
            className="delete-boundary-btn"
            disabled={disabled}
            type="button"
            onClick={handleClearBoundary}
        >
            <Trash2 size={18}/>Delete Boundary
        </button>
    )
}