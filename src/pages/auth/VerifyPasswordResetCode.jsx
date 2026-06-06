import BackArrow from "../../util/BackArrow"
import { NavLink } from "react-router-dom"

export default function Verification() {
  return (
    <div className="forgot-password-container">
      <BackArrow path="auth/forgot-password" />
      <div className="content-section">
        <h1>OTP Verification</h1>
        <p>We sent you a verification code to your email</p>

        <form className="ver-code-form">
          <div className="input-group">
            <input
              type="number"
              placeholder="6-digitcode"
              className="ver-code"
            />
          </div>
          <button type="submit" className="submit-button">
            Verify
          </button>
          <p>Didn't recieve a code? <a href="">Resend</a></p>
          <NavLink to='/auth/reset-password'>change password</NavLink>
        </form>
      </div>
    </div>
  )
}