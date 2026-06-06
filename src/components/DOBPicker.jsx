import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DOBPicker({ dob, setDob }) {

  return (
    <DatePicker
      selected={dob}
      onChange={(date) => setDob(date)}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      maxDate={new Date()}
      placeholderText="Select your date of birth"
      className="border py-1.5 px-3 rounded-md mb-2 w-full"
      required
    />
  );
}