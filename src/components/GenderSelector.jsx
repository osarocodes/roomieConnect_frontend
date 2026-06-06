const GenderSelector = ({ gender, setGender }) => {
  return (
    <div className="">
      <h4 className="">Select Gender:</h4>

        <div className="flex gap-2 bg-accent/20 w-2/4 p-2 rounded-md">
          <div className="">
            <label htmlFor="male" className="flex gap-2">
              Male 
              <input 
                type="radio"
                id="male" 
                name="gender" 
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="">
            <label htmlFor="female" className="flex gap-2">
              Female 
              <input 
                type="radio" 
                id="female" 
                name="gender" 
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                required
              />
            </label>
          </div>
        </div>
    </div>
  )
}

export default GenderSelector