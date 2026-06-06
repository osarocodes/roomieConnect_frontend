import { NavLink } from "react-router-dom"
import BackArrow from "../../util/BackArrow"

export default function PasswordChange() {
  return (
    <div className="password-change-page">
      <BackArrow path="auth/verify-code" />
      <div className="content-section">
        <h1>Create new password</h1>
        <p>Enter your new password. Your new password must be unique from those previously used.</p>
        <form className="">
          <input 
            type="password"
            name="" 
            id=""
            placeholder="Your password must be 6-20 characters"
            className="passInput"
          />
          <input
            type="password"
            placeholder="Confirm Your Password" 
            className="passInput"
          />
          <button type="submit" className="btn">
            Reset Password
          </button>
          <NavLink to='/auth/success'>success</NavLink>
        </form>
      </div>
    </div>
  )
}