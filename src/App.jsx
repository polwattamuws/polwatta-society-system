import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FormProvider, useFormContext } from './FormContext';
import Step1Bio from './components/Step1Bio';
import Step2Membership from './components/Step2Membership';
import Step3Benefits from './components/Step3Benefits';
import Step4Nominees from './components/Step4Nominees';
import ReviewSubmit from './components/ReviewSubmit';
import Dashboard from './Dashboard';
import Login from './Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }
    return children;
};

const MultiStepForm = () => {
    const { state, dispatch } = useFormContext();
    const { step } = state;

    const nextStep = () => dispatch({ type: 'NEXT_STEP' });
    const prevStep = () => dispatch({ type: 'PREV_STEP' });

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-10 relative">
                <h1 className="text-3xl font-bold text-gray-900">Polwatta Death Donation Society</h1>
                <p className="text-gray-500">Member Registration System (සාමාජික ලියාපදිංචිය)</p>
                <Link to="/admin" className="absolute top-0 right-0 text-sm text-brand-600 hover:text-brand-800 underline">Admin Login</Link>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 bg-gray-200 rounded-full h-2.5">
                <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
            </div>

            {step === 1 && <Step1Bio />}
            {step === 2 && <Step2Membership />}
            {step === 3 && <Step3Benefits />}
            {step === 4 && <Step4Nominees />}
            {step === 5 && <ReviewSubmit />}

            <div className="flex justify-between mt-8">
                {step > 1 && step < 6 && ( // Don't show prev on step 1, or after success (step 6 logic handles itself but we cap at 5 here)
                    <button onClick={prevStep} className="btn-secondary">
                        Previous (ආපසු)
                    </button>
                )}
                {step < 5 && (
                    <button onClick={nextStep} className="btn-primary ml-auto">
                        Next (ඊළඟ)
                    </button>
                )}
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <FormProvider>
                        <div className="min-h-screen bg-gray-100/50">
                            <MultiStepForm />
                        </div>
                    </FormProvider>
                } />
                <Route path="/admin" element={<Login />} />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                        <div className="min-h-screen bg-gray-100">
                            <Dashboard />
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
