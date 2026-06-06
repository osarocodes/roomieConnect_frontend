import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className='py-5 border-b border-base-300 flex justify-center items-center bg-base-100'>
      <nav className='text-center text-xl'>
        <NavLink to='/auth/login' className={({ isActive }) => isActive ? 'font-extrabold bg-accent p-1.5 mr-2 rounded-md' : ''}>Login</NavLink>
        <NavLink to='/auth/signup' className={({ isActive }) => isActive ? 'font-extrabold bg-accent p-1.5 ml-2 rounded-md' : ''}>Signup</NavLink>
      </nav>
    </div>
  )
}