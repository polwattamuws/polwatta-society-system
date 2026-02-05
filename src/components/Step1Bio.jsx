import React from 'react';
import { useFormContext } from '../FormContext';

const Step1Bio = () => {
    const { state, dispatch } = useFormContext();
    const { bio } = state;

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_BIO', payload: { [name]: value } });
    };

    const handleSpouseChange = (e) => {
        const { name, value } = e.target;
        dispatch({
            type: 'UPDATE_BIO',
            payload: { spouse: { ...bio.spouse, [name]: value } }
        });
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">1. මූලික තොරතුරු (Basic Bio-Data)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">නම මුලට (Title)</label>
                    <select
                        name="title"
                        value={bio.title}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="Mr">මහතා (Mr)</option>
                        <option value="Mrs">මහත්මිය (Mrs)</option>
                        <option value="Miss">මෙනවිය (Miss)</option>
                        <option value="Rev">පූජ්‍ය (Rev)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">සම්පූර්ණ නම (Full Name)</label>
                    <input
                        type="text"
                        name="name"
                        value={bio.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">උපන් දිනය (Date of Birth)</label>
                    <input
                        type="date"
                        name="dob"
                        value={bio.dob}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">ජා.හැ.අංකය (NIC Number)</label>
                    <input
                        type="text"
                        name="nic"
                        value={bio.nic}
                        onChange={handleChange}
                        maxLength={12}
                        placeholder="123456789V or 1990..."
                        className="input-field"
                    />
                    {(bio.nic.length !== 10 && bio.nic.length !== 12 && bio.nic.length > 0) && (
                        <p className="text-red-500 text-xs">අක්ෂර 10ක් හෝ 12ක් විය යුතුය.</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">දුරකථන අංකය (Phone)</label>
                    <input
                        type="tel"
                        name="phone"
                        value={bio.phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            handleChange({ target: { name: 'phone', value: val } });
                        }}
                        className="input-field"
                    />
                    {bio.phone.length > 0 && bio.phone.length !== 10 && (
                        <p className="text-red-500 text-xs">ඉලක්කම් 10ක් තිබිය යුතුය.</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">ලිපිනය (Address)</label>
                    <textarea
                        name="address"
                        value={bio.address}
                        onChange={handleChange}
                        rows="3"
                        className="input-field"
                    ></textarea>
                </div>

                <div className="md:col-span-2">
                    <span className="block text-sm font-medium text-gray-700 mb-2">සිවිල් තත්ත්වය (Civil Status)</span>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="civilStatus"
                                value="Unmarried"
                                checked={bio.civilStatus === 'Unmarried'}
                                onChange={handleChange}
                                className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="ml-2 text-gray-700">අවිවාහක (Unmarried)</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="civilStatus"
                                value="Married"
                                checked={bio.civilStatus === 'Married'}
                                onChange={handleChange}
                                className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="ml-2 text-gray-700">විවාහක (Married)</span>
                        </label>
                    </div>
                </div>
            </div>

            {bio.civilStatus === 'Married' && (
                <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-3">කලත්‍රයාගේ තොරතුරු (Spouse Details)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">නම (Spouse Name)</label>
                            <input
                                type="text"
                                name="name"
                                value={bio.spouse.name}
                                onChange={handleSpouseChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ජා.හැ.අංකය (Spouse NIC)</label>
                            <input
                                type="text"
                                name="nic"
                                value={bio.spouse.nic}
                                onChange={handleSpouseChange}
                                maxLength={12}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">උපන් දිනය (Spouse DOB)</label>
                            <input
                                type="date"
                                name="dob"
                                value={bio.spouse.dob}
                                onChange={handleSpouseChange}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step1Bio;
