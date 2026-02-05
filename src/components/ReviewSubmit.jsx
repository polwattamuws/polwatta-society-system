import React, { useState } from 'react';
import { useFormContext } from '../FormContext';
import { CheckCircle } from 'lucide-react';

const ReviewSubmit = () => {
    const { state } = useFormContext();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:3001/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state),
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'සාර්ථකයි! ලියාපදිංචිය සම්පූර්ණයි. (Registration Successful!)' });
            } else {
                setMessage({ type: 'error', text: 'දෝෂයක්! ' + data.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server Error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (message?.type === 'success') {
        return (
            <div className="card text-center py-10 animate-fade-in">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{message.text}</h2>
                <p className="text-gray-600">You can now close this form or refresh to start new.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 btn-primary"
                >
                    New Registration
                </button>
            </div>
        );
    }

    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">6. Review & Submit</h2>

            <div className="space-y-4 text-sm text-gray-700">
                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold text-gray-900">Bio Data</h3>
                    <p>{state.bio.title} {state.bio.name}</p>
                    <p>NIC: {state.bio.nic}</p>
                    <p>Civil Status: {state.bio.civilStatus}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold text-gray-900">Membership</h3>
                    <p>Member No: {state.membership.membershipNo} (Zone: {state.membership.zone})</p>
                    <p>Positions: {state.membership.positions.length}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold text-gray-900">Benefits</h3>
                    <p>Past Benefits: {state.pastBenefits.length}</p>
                    <p>Other Benefits: {state.otherBenefits.length}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold text-gray-900">Nominees</h3>
                    {state.nominees.map((n, i) => (
                        <p key={i}>{n.name} - {n.relationship}</p>
                    ))}
                </div>
            </div>

            {message?.type === 'error' && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {message.text}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary w-full mt-6 py-3 text-lg"
            >
                {submitting ? 'Submitting...' : 'Confirm & Submit Registration'}
            </button>
        </div>
    );
};

export default ReviewSubmit;
