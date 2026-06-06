import { NavLink } from "react-router-dom"
import { ArrowLeft } from 'lucide-react';

export default function BackArrow({ path }) {
    return (
        <NavLink to={`/${path}`} className="arrow-container">
            <span>
                <ArrowLeft size={30} />
            </span>
        </NavLink>
    )
}