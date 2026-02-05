import React, { useState } from 'react';
import { useFormContext } from '../FormContext';
import { Plus, Trash2 } from 'lucide-react';

const Step3Benefits = () => {
    const { state, dispatch } = useFormContext();
    const { pastBenefits, otherBenefits } = state;

    const [deathBenefit, setDeathBenefit] = useState({
        deceasedName: '',
        relationship: 'Parent',
        yearDeath: '',
        amount: ''
    });

    const [otherBenefit, setOtherBenefit] = useState({
        description: '',
        year: '',
        amount: ''
    });

    const addDeathBenefit = () => {
        if (!deathBenefit.deceasedName || !deathBenefit.yearDeath) return;

        // Validation: Limit "Elder" + "Other" to 2 combined
        if (['Elder', 'Other'].includes(deathBenefit.relationship)) {
            const existingCount = pastBenefits.filter(pb => ['Elder', 'Other'].includes(pb.relationship)).length;
            if (existingCount >= 2) {
                alert("වැඩිහිටි සහ වෙනත් කාණ්ඩවලින් ඇතුළත් කළ හැක්කේ උපරිම පුද්ගලයන් දෙදෙනෙකු පමණි. (Max 2 allowed for Elders/Other)");
                return;
            }
        }

        // Validation: Max 1 Spouse
        if (deathBenefit.relationship === 'Spouse') {
            const hasSpouse = pastBenefits.some(pb => pb.relationship === 'Spouse');
            if (hasSpouse) {
                alert("කලත්‍රයා සඳහා එක් වරක් පමණක් ඇතුළත් කළ හැක. (Max 1 allowed for Spouse)");
                return;
            }
        }

        dispatch({ type: 'ADD_PAST_BENEFIT', payload: deathBenefit });
        setDeathBenefit({ ...deathBenefit, deceasedName: '', yearDeath: '', amount: '' });
    };

    const addOtherBenefit = () => {
        if (!otherBenefit.description || !otherBenefit.year) return;
        dispatch({ type: 'ADD_OTHER_BENEFIT', payload: otherBenefit });
        setOtherBenefit({ description: '', year: '', amount: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Section 3: Death Benefits */}
            <div className="card">
                <h2 className="section-title">3. ප්‍රතිලාභ ඉතිහාසය (Death Benefit History)</h2>
                <p className="text-sm text-gray-500 mb-4">මීට පෙර මරණාධාර ලබාගෙන තිබේද? (Have you received death benefits before?)</p>

                <div className="bg-red-50 p-4 rounded-md border border-red-100 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">මියගිය අයගේ නම (Deceased Name)</label>
                            <input
                                type="text"
                                value={deathBenefit.deceasedName}
                                onChange={(e) => setDeathBenefit({ ...deathBenefit, deceasedName: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">සම්බන්ධතාවය (Relationship)</label>
                            <select
                                value={deathBenefit.relationship}
                                onChange={(e) => setDeathBenefit({ ...deathBenefit, relationship: e.target.value })}
                                className="input-field"
                            >
                                <option value="Parent">Parent (දෙමාපියන්)</option>
                                <option value="Spouse">Spouse (කලත්‍රයා)</option>
                                <option value="Child">Child (දරුවන්)</option>
                                <option value="Sibling">Sibling (සහෝදරයා/සහෝදරිය)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">මියගිය වර්ෂය (Year)</label>
                            <input
                                type="number"
                                placeholder="YYYY"
                                value={deathBenefit.yearDeath}
                                onChange={(e) => setDeathBenefit({ ...deathBenefit, yearDeath: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">ලැබුණු මුදල (Amount)</label>
                            <input
                                type="number"
                                value={deathBenefit.amount}
                                onChange={(e) => setDeathBenefit({ ...deathBenefit, amount: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <button onClick={addDeathBenefit} className="btn-secondary w-full flex items-center justify-center gap-2 mt-2">
                        <Plus size={16} /> Add Death Benefit Record
                    </button>
                </div>

                {pastBenefits.length > 0 && (
                    <ul className="divide-y divide-gray-200">
                        {pastBenefits.map((item, idx) => (
                            <li key={idx} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.deceasedName} ({item.relationship})</p>
                                    <p className="text-xs text-gray-500">{item.yearDeath} - Rs. {item.amount}</p>
                                </div>
                                <button onClick={() => dispatch({ type: 'REMOVE_PAST_BENEFIT', payload: idx })} className="text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Section 4: Other Benefits */}
            <div className="card">
                <h2 className="section-title">4. වෙනත් ප්‍රතිලාභ (Other Benefits)</h2>
                <p className="text-sm text-gray-500 mb-4">වෙනත් ප්‍රතිලාභ ලබාගෙන තිබේද? (Excluding death benefits)</p>

                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">ස්වභාවය (Nature of Benefit)</label>
                            <input
                                type="text"
                                value={otherBenefit.description}
                                onChange={(e) => setOtherBenefit({ ...otherBenefit, description: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">වර්ෂය (Year)</label>
                            <input
                                type="number"
                                placeholder="YYYY"
                                value={otherBenefit.year}
                                onChange={(e) => setOtherBenefit({ ...otherBenefit, year: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">වටිනාකම් (Amount)</label>
                            <input
                                type="number"
                                value={otherBenefit.amount}
                                onChange={(e) => setOtherBenefit({ ...otherBenefit, amount: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div className="flex items-end">
                            <button onClick={addOtherBenefit} className="btn-secondary w-full flex items-center justify-center gap-2">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                    </div>
                </div>

                {otherBenefits.length > 0 && (
                    <ul className="divide-y divide-gray-200">
                        {otherBenefits.map((item, idx) => (
                            <li key={idx} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                                    <p className="text-xs text-gray-500">{item.year} - Rs. {item.amount}</p>
                                </div>
                                <button onClick={() => dispatch({ type: 'REMOVE_OTHER_BENEFIT', payload: idx })} className="text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Step3Benefits;
