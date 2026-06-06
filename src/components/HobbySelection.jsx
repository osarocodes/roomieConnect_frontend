import { hobbiesList } from "@/data/hobbyList.js";

export default function HobbyChips({ selectedHobbies, setSelectedHobbies }) {
  const toggleHobby = (hobby) => {

    const current = Array.isArray(selectedHobbies) ? selectedHobbies : [];

    if (current.includes(hobby)) {
      setSelectedHobbies((prev = []) => prev.filter((h) => h !== hobby));
    } else if (current.length < 5) {
      setSelectedHobbies((prev = []) => [...prev, hobby]);
      console.log(selectedHobbies[4]);
    }
  };

  return (
    <>
      <p className="mt-3">Interests:</p>
      <div className="flex flex-wrap bg-accent/20 p-3 rounded-md gap-2 my-2">
        {hobbiesList?.map((hobby) => (
          <button
            key={hobby}
            type="button"
            className={`btn ${ Array.isArray(selectedHobbies) && selectedHobbies.includes(hobby) ? "btn-secondary" : ""}`}
            onClick={() => toggleHobby(hobby)}
          >
            {hobby}
          </button>
        ))}
      </div>
    </>
  );
}