import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import AccountInfo from './SignUpAccountInfoStep'
import PersonalInfo from './SignUpPersonalInfoStep'
import Personality from './SignUpPersonalityStep'
import ImageUploader from './SignUpUploadStep';
import Nav from '../../util/Nav'
import { validateStep } from '../../util/stepValidator';
import { useAuthStore } from '@/stores/useAuthStore';
import toast from 'react-hot-toast';
import ProgressBar from '@/components/ProgressBar';

export default function SignupContainer() {
	const navigate = useNavigate();
	const [gender, setGender] = useState();
	const [dob, setDob] = useState(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
	const [filePreview, setFilePreview] = useState(null);
	const [step, setStep] = useState(1);
	const [selectedHobbies, setSelectedHobbies] = useState([]);
	const [ formData, setFormData ] = useState({
		identity: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			gender: '',
			dob: ''
		},
		auth: {
			password: '',
			confirmPassword: ''
		},
		university: {
			level: '',
			department: '',
			yearOfCompletion: '',
		},
		lifestyleHabits: {
			sleepSchedule: '',
			cleanliness: '',
			socialHabits: '',
			studyHabits: '',
			noiseTolerance: '',
			conflictManagement: '',
			alignmentTest: ''
		},
		preferences: {
			petPerson: '',
			cigaretteSmoker: '',
			guests: '',
			spaceSharing: '',
			musicVolume: '',
			preferredGender: '',
			sharingPersonalItems: ''
		},
		budget: {
			rentRange: ''
		},
		locationPreference: {
			preferredArea: ''
		},
		profile: {
			about: '',
			interests: [],
		},
		// File objects will be handled separately and added to FormData on submission
	});

	// State for files
	const [profilePic, setProfilePic] = useState(null);
	const [admissionLetterFile, setAdmissionLetterFile] = useState(null);
	const { signup, isSigningUp, authUser } = useAuthStore();

	const fieldRefs = useRef({});

	const registerRef = (id, element) => {
        if (id && element) {
            fieldRefs.current[id] = element;
        }
    };

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			identity: {
				...prev.identity,
				gender: gender,
				dob: dob,
			},
			profile: {
				...prev.profile,
				interests: selectedHobbies,
			}
		}));
	}, [selectedHobbies, gender, dob])

	const nextStep = () => setStep(step + 1)
	const prevStep = () => setStep(step - 1)

	
	const handleChange = (category) => (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [name]: value
            }
        }));
    };

	// --- File Handlers ---
	const pdfObjectUrlRef = useRef(null);

	useEffect(() => {
		// Cleanup object URLs to prevent memory leaks
		return () => {
			if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
			if (filePreview) URL.revokeObjectURL(filePreview);
			if (pdfObjectUrlRef.current) URL.revokeObjectURL(pdfObjectUrlRef.current);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleProfileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/avif", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			toast.error("Invalid file type. Please select a JPEG, PNG, GIF, AVIF, or WEBP image.");
			return;
		}
	
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Profile picture size exceeds 2MB limit");
			return;
		}
		if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
		setProfilePic(file);
		setImagePreviewUrl(URL.createObjectURL(file));
	};
	
	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (!file) return;

		const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "image/avif", "image/webp", "image/gif"];
		if (!allowedTypes.includes(file.type)) {
			toast.error("Invalid file type. Please select a JPEG, PNG, PDF, AVIF, WEBP, or GIF file.");
			return;
		}
	
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Admission letter size exceeds 5MB limit");
			return;
		}

		// Clean up previous previews
		if (filePreview) URL.revokeObjectURL(filePreview);
		if (pdfObjectUrlRef.current) URL.revokeObjectURL(pdfObjectUrlRef.current);
	
		setAdmissionLetterFile(file);
		if (file.type !== 'application/pdf') {
			setFilePreview(URL.createObjectURL(file));
		} else {
			pdfObjectUrlRef.current = URL.createObjectURL(file);
		  setFilePreview(null); // Ensure image preview is cleared for PDFs
		}
	};

	const handleRemoveProfile = () => {
		if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
		setProfilePic(null);
		setImagePreviewUrl(null);
	};
	
	const handleRemoveLetter = () => {
		if (filePreview) URL.revokeObjectURL(filePreview);
		if (pdfObjectUrlRef.current) URL.revokeObjectURL(pdfObjectUrlRef.current);
		setAdmissionLetterFile(null);
		setFilePreview(null);
	};

	// --- Form Submission ---
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const validationResult = validateStep(step, formData, selectedHobbies, profilePic, admissionLetterFile);

		if (!validationResult.isValid) {
			toast.error(validationResult.message);
			const element = fieldRefs.current[validationResult.errorField];
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			return;
		}
		console.log("Auth User:", authUser);
		console.log("Form Data:", formData);
		console.log("Profile Picture:", profilePic);
		console.log("Admission Letter File:", admissionLetterFile);

		// If not the last step, just go to the next one
		if (step < steps.length) {
			nextStep();
			return;
		}

		// On the last step, perform the final submission
		// Frontend: handleFormSubmit
		const finalFormData = new FormData();

		// Send all text data as a single JSON string
		finalFormData.append('data', JSON.stringify(formData));

		// Append files separately
		if (profilePic) finalFormData.append('profilePic', profilePic);
		if (admissionLetterFile) finalFormData.append('admissionLetter', admissionLetterFile);
		console.log("Final FormData:", finalFormData);

		// Call the signup action from the store
		const success = await signup(finalFormData);
		console.log("Signup success:", success);
		if (success) {
			navigate('/');
		}
	};

	const steps = [
		<AccountInfo formData={formData} handleChange={handleChange} registerRef={registerRef} />,
		<PersonalInfo formData={formData} handleChange={handleChange} setDob={setDob} dob={dob} gender={gender} setGender={setGender} registerRef={registerRef} />,
		<Personality formData={formData} handleChange={handleChange} page={1} selectedHobbies={selectedHobbies} setSelectedHobbies={setSelectedHobbies} isLastPersonalityPage={false} registerRef={registerRef} />,
		<Personality formData={formData} handleChange={handleChange} page={2} isLastPersonalityPage={false} registerRef={registerRef} />, // Step 4
		<Personality formData={formData} handleChange={handleChange} page={3} isLastPersonalityPage={false} registerRef={registerRef} />, // Step 5
		<Personality formData={formData} handleChange={handleChange} page={4} isLastPersonalityPage={false} registerRef={registerRef} />, // Step 6
		<Personality formData={formData} handleChange={handleChange} page={5} isLastPersonalityPage={false} registerRef={registerRef} />, // Step 7
		<Personality formData={formData} handleChange={handleChange} page={6} isLastPersonalityPage={true} registerRef={registerRef} />, // Step 8
		<ImageUploader 
			prevStep={prevStep}
			imagePreviewUrl={imagePreviewUrl}
			filePreview={filePreview}
			admissionLetter={admissionLetterFile}
			pdfObjectUrlRef={pdfObjectUrlRef}
			handleProfileChange={handleProfileChange}
			handleFileChange={handleFileChange}
			handleRemoveProfile={handleRemoveProfile}
			handleRemoveLetter={handleRemoveLetter}
			loading={isSigningUp}
			registerRef={registerRef}
		/>
	]

	return (
		<div className='min-h-screen'>
				{ step === 1 && <Nav /> }
				<div className="flex flex-col justify-center p-6 sm:p-12">
					<ProgressBar currentStep={step} totalSteps={steps.length + 1} />
					<form noValidate onSubmit={handleFormSubmit} className=''>
					{ steps[step - 1] }
						<div className="flex justify-between items-center mt-5 ">
							{step > 1 &&  (
								<button 
									type="button"
									onClick={prevStep}
									className="btn btn-secondary"
									disabled={isSigningUp}
								>
									Back
								</button>
							)}

							<button 
								type="submit"
								className="btn btn-primary ml-auto"
								disabled={isSigningUp}
							>
								{isSigningUp ? 'Submitting...' : (step === steps.length ? 'Submit' : 'Continue')}
							</button>
						</div>
					</form>
				</div>
		</div>
	)
}