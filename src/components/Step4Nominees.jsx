import React, { useState } from 'react';
import { useFormContext } from '../FormContext';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const Step4Nominees = () => {
    const { state, dispatch } = useFormContext();
    const { nominees, pastBenefits } = state;

    const [newNominee, setNewNominee] = useState({
        name: '',
        relationship: 'Spouse',
        address: '',
        share: 100
    });

    const [error, setError] = useState(null);

    const validateNominee = () => {
        // 1. Check if person is in Past Benefits (Deceased)
        const isDeceased = pastBenefits.some(
            pb => pb.deceasedName.toLowerCase() === newNominee.name.toLowerCase() &&
                pb.relationship === newNominee.relationship
        );
        if (isDeceased) {
            return "This person is listed as deceased in Past Benefits. Cannot nominate.";
        }

        // 2. Spouse Limit (Max 1)
        if (newNominee.relationship === 'Spouse') {
            const hasSpouse = nominees.some(n => n.relationship === 'Spouse');
            if (hasSpouse) return "You can only nominate one Spouse.";
        }

        // 3. Elders/Other Limit (Max 2 combined)
        if (['Elder', 'Other'].includes(newNominee.relationship)) {
            const existingCount = nominees.filter(n => ['Elder', 'Other'].includes(n.relationship)).length;
            if (existingCount >= 2) return "වැඩිහිටි සහ වෙනත් කාණ්ඩවලින් ඇතුළත් කළ හැක්කේ උපරිම පුද්ගලයන් දෙදෙනෙකු පමණි. (Max 2 allowed for Elders/Other)";
        }

        return null;
    };

    const addNominee = () => {
        setError(null);
        if (!newNominee.name || !newNominee.address) return;

        const validationError = validateNominee();
        if (validationError) {
            setError(validationError);
            return;
        }

        dispatch({ type: 'ADD_NOMINEE', payload: newNominee });
        setNewNominee({ name: '', relationship: 'Spouse', address: '', share: 100 });
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">5. යෝජිත ප්‍රතිලාභීන් (Future Nominees)</h2>
            <p className="text-sm text-gray-500 mb-4">සාමාජිකයාගේ අභාවයෙන් පසු ප්‍රතිලාභ ලැබිය යුත්තේ කවුරුන්ද? (Who receives benefits?)</p>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-blue-50 p-4 rounded-md border border-blue-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700">නම (Name)</label>
                    <input
                        type="text"
                        value={newNominee.name}
                        onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">සම්බන්ධතාවය (Relationship)</label>
                    <select
                        value={newNominee.relationship}
                        onChange={(e) => setNewNominee({ ...newNominee, relationship: e.target.value })}
                        className="input-field"
                    >
                        <option value="Spouse">Spouse (කලත්‍රයා)</option>
                        <option value="Child">Child (දරුවා)</option>
                        <option value="Elder">Elder (වැඩිහිටියන්)</option>
                        <option value="Other">Other (වෙනත්)</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">ලිපිනය (Address)</label>
                    <input
                        type="text"
                        value={newNominee.address}
                        onChange={(e) => setNewNominee({ ...newNominee, address: e.target.value })}
                        className="input-field"
                    />
                </div>
                <div>
                    <button onClick={addNominee} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                        <Plus size={16} /> Add Nominee
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {nominees.map((nom, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                        <div>
                            <p className="font-medium text-gray-900">{nom.name} <span className="text-sm text-gray-500">({nom.relationship})</span></p>
                            <p className="text-xs text-gray-500">{nom.address}</p>
                        </div>
                        <button onClick={() => dispatch({ type: 'REMOVE_NOMINEE', payload: idx })} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step4Nominees;
