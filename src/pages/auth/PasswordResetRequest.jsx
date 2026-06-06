import { NavLink } from "react-router-dom"
import BackArrow from "../../util/BackArrow"

export default function EmailCollection() {
  return (
    <div className="forgot-password-container">
      <BackArrow path="auth/login"/>
      <div className="content-section">
        <h1>Forgot password?</h1>
        <p>Fill in your email and we'll send a code to reset your password</p>

        <form className="email-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="jablowurl@gmail.com"
              className="email-input"
            />
          </div>
          
          <button type="submit" className="submit-button">
            Send Code
          </button>
          <NavLink to='/auth/verify-code'>Validate</NavLink>
        </form>
      </div>
    </div>
  )
}