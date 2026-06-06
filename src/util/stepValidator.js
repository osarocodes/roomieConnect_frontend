import { questionBank } from '../data/questionBank';

/**
 * StepValidator - This handles validation across different pages by accessing thier 
 * page (step) number, thereby making validation more dynamic since I am dealing with
 * a multi-page signup process.
 */

const stepValidators = {
    1: (formData) => {
        if (!formData.identity.email.trim()) {
            return { isValid: false, errorField: 'email', message: "Email is required" };
        }
        if (!/\S+@\S+\.\S+/.test(formData.identity.email)) {
            return { isValid: false, errorField: 'email', message: "Invalid email address" };
        }
        if (!formData.auth.password) {
            return { isValid: false, errorField: 'password', message: 'Password is required' };
        }
        if (!formData.auth.confirmPassword) {
            return { isValid: false, errorField: 'confirmPassword', message: 'Confirm Password is required' };
        }
        if (formData.auth.password.length < 6) {
            return { isValid: false, errorField: 'password', message: 'Password must be at least 6 characters' };
        }
        if (formData.auth.password !== formData.auth.confirmPassword) {
            return { isValid: false, errorField: 'confirmPassword', message: 'Passwords do not match' };
        }
        return { isValid: true, errorField: null, message: null };
    },
    2: (formData) => {
        if (!formData.identity.firstName.trim()) {
            return { isValid: false, errorField: 'firstName', message: "First name is required" };
        }
        if (!formData.identity.lastName.trim()) {
            return { isValid: false, errorField: 'lastName', message: "Last name is required" };
        }
        if (!formData.identity.phone.trim()) {
            return { isValid: false, errorField: 'phone', message: "Phone number is required" };
        }
        if (!/^\d{11}$/.test(formData.identity.phone.trim())) {
            return { isValid: false, errorField: 'phone', message: "Invalid phone number" };
        }
        if (!formData.university.department.trim()) {
            return { isValid: false, errorField: 'department', message: "Department is required" };
        }
        if (!formData.university.yearOfCompletion) {
            return { isValid: false, errorField: 'yearOfCompletion', message: "Year of study is required" };
        }
        if (!formData.identity.gender) {
            return { isValid: false, errorField: 'gender', message: "Please select a gender" };
        }
        if (!formData.identity.dob) {
            return { isValid: false, errorField: 'DOB', message: "Date of birth is required" };
        }
        return { isValid: true, errorField: null, message: null };
    },
};

const validatePersonalityStep = (page, formData, selectedHobbies) => {
    const questionsPerPage = 3;
    const startIndex = (page - 1) * questionsPerPage;
    const selectedQuestions = questionBank.slice(startIndex, startIndex + questionsPerPage);

    if (page === 1) {
        if (selectedHobbies.length === 0) {
            return { isValid: false, errorField: 'hobbies', message: "Select at least one interest" };
        }
    }

    for (const q of selectedQuestions) {
        if (!formData[q.category][q.id]) {
            return { isValid: false, errorField: q.id, message: `Please answer: "${q.label}"` };
        }
    }
    
    if (page === 6) { 
        const aboutLength = formData.profile.about?.trim().length || 0;
        if (aboutLength < 50) {
            return { isValid: false, errorField: 'about', message: `About section must be at least 50 characters (${aboutLength}/50)` };
        }
    }

    return { isValid: true, errorField: null, message: null };
}

export const validateStep = (step, formData, selectedHobbies) => {
    if (step >= 3 && step <= 8) {
        const personalityPage = step - 2;
        return validatePersonalityStep(personalityPage, formData, selectedHobbies);
    } else if (stepValidators[step]) {
        return stepValidators[step](formData);
    }
    return { isValid: true, errorField: null, message: null }; // For steps without validation
};