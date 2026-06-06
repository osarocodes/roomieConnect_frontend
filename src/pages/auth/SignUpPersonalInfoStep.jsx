import DOBPicker from "../../components/DOBPicker"
import GenderSelector from "../../components/GenderSelector"

const PersonalInfoForm = ({ 
  formData,
  handleChange,
  gender, 
  setGender,
  setDob,
  dob,
  registerRef
}) => {

  return (
    <div className="">
      <h3 className="text-2xl font-bold mt-2">Personal Information:</h3>
      <div className="space-y-3 mt-5">
        <div ref={(el) => registerRef('firstName', el)}>
          <input 
            type="text"
            name="firstName"
            id="firstName"
            value={formData.identity.firstName}
            onChange={handleChange('identity')}
            className="border w-full p-2 rounded-md"
            placeholder="First Name"
          />
      </div>

      <div ref={(el) => registerRef('lastName', el)}>
        <input 
          type="text"
          name="lastName"
          id="lastName"
          value={formData.identity.lastName}
          onChange={handleChange('identity')}
          className="border w-full p-2 rounded-md"
          placeholder="Last Name"
        />
      </div>

      <div ref={(el) => registerRef('phone', el)}>
        <input type='tel' 
          name="phone"
          id="phone"
          value={formData.identity.phone}
          onChange={handleChange('identity')}
          className="border w-full p-2 rounded-md"
          placeholder="Mobile Number"
        />
      </div>

      <div ref={(el) => registerRef('level', el)}>
          <select 
            name="level" 
            id="level"
            value={formData.university.level}
            onChange={handleChange('university')}
            className="w-full
            rounded-md
            border
            p-2"
          >
          <option value="" disabled>--select-level--</option>
          <option value="100L">100lvl</option>
          <option value="200L">200lvl</option>
          <option value="300L">300lvl</option>
          <option value="400L">400lvl</option>
          <option value="500L">500lvl</option>
          <option value="600L">600lvl</option>
          <option value="700L">Graduate</option>
        </select>
      </div>

      <div ref={(el) => registerRef('department', el)}>
        <input type='text' 
          name="department"
          id="department"
          value={formData.university.department}
          onChange={handleChange('university')}
          className="border w-full p-2 rounded-md"
          placeholder="Department e.g computer science, geology..."
        />
      </div>

      <div ref={(el) => registerRef('yearOfCompletion', el)}>
        <input type='text' 
          name="yearOfCompletion"
          id="yearOfCompletion"
          value={formData.university.yearOfCompletion}
          onChange={handleChange('university')}
          className="border w-full p-2 rounded-md"
          placeholder="Year of graduation e.g 2027"
        />
      </div>

      <div ref={(el) => registerRef('DOB', el)}>
        <DOBPicker setDob={setDob} dob={dob} />
      </div>
      <div ref={(el) => registerRef('gender', el)}>
        <GenderSelector gender={gender} setGender={setGender}/>
      </div>
      </div>
    </div>
  )
}
export default PersonalInfoForm