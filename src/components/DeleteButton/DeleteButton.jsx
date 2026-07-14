import "./DeleteButton.css"
//import { Trash2 } from "lucide-react"

export default function DeleteButton({
    label,
    icon,
    onClick,
    disabled = false
}){
    return(
        <button
            className="delete-boundary-btn"
            disabled={disabled}
            type="button"
            onClick={onClick}
        >
            {icon}{label}
        </button>
    )
}