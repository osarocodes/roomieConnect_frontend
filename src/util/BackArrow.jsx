import { NavLink } from "react-router-dom"
import { ArrowLeft } from 'lucide-react';

export default function BackArrow({ path }) {
    return (
        <NavLink to={`/${path}`} className="arrow-container">
            <span className="flex items-center gap-2">
                <ArrowLeft size={30} />
                <p>Go Back</p>
            </span>
        </NavLink>
    )
}