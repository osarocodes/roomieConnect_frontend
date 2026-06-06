import { questionBank } from '../../data/questionBank';
import HobbySelection from '../../components/HobbySelection'

export default function Personality({ formData, handleChange, page, setSelectedHobbies, selectedHobbies, isLastPersonalityPage, registerRef }) {
  const questionsPerPage = 3;
  const startIndex = (page - 1) * questionsPerPage;
  const selectedQuestions = questionBank.slice(startIndex, startIndex + questionsPerPage);

  return (
    <div>
      <h3 className='text-2xl font-bold mt-2'>Personality Check</h3>
      <div ref={(el) => registerRef('hobbies', el)}>
        {page === 1 ? <HobbySelection selectedHobbies={selectedHobbies} setSelectedHobbies={setSelectedHobbies}/> : ''}
      </div>
      
      {selectedQuestions.map((q) => (
        <div key={q.id} className="my-5" ref={(el) => registerRef(q.id, el)}>
          <label className="text-xl font-bold">{q.label}</label>
          <div className="flex flex-col mt-3 gap-2">
            {q.options.map((option, i) => (
              <label key={i} className={`border rounded-md flex items-center justify-between p-2 ${formData[q.category] && formData[q.category][q.id] === option ? "text-primary" : ""}`}>
                <input
                  type="radio"
                  name={q.id}
                  value={option}
                  checked={formData[q.category] && formData[q.category][q.id] === option}
                  onChange={handleChange(q.category)}
                  className="hidden"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {isLastPersonalityPage && (
        <div ref={(el) => registerRef('about', el)}>
          <h3>Write about yourself</h3>
          <textarea 
            name="about"
            id="about"
            value={formData.profile.about || ''}
            onChange={handleChange('profile')}
            placeholder="Tell us a bit about yourself...start by telling us your first name, and then what you do, what your hobbies are and finally, what traits you'd like to find in a roommate."
            className="border border-gray-500 rounded-md w-full p-3"
            required
            rows="5"
          />
        </div>
      )}
    </div>
  );
}