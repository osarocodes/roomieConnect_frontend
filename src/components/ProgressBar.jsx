const ProgressBar = ({ currentStep, totalSteps}) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full mb-3 rounded-full h-1 bg-primary/40">
            <div className="bg-primary h-1 rounded-full" style={{ width: `${progressPercentage}%`}}></div>
        </div>
    );
};
export default ProgressBar;