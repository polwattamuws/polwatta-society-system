import React, { useState } from 'react';
import { useFormContext } from '../FormContext';
import { Plus, Trash2 } from 'lucide-react';

const Step2Membership = () => {
    const { state, dispatch } = useFormContext();
    const { membership } = state;
    const positions = membership.positions || [];

    const [newPosition, setNewPosition] = useState({
        title: 'President',
        yearAppointed: '',
        yearResigned: ''
    });

    const handleMembershipChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_MEMBERSHIP', payload: { [name]: value } });
    };

    const addPosition = () => {
        if (!newPosition.yearAppointed) return; // Validation
        dispatch({ type: 'ADD_POSITION', payload: newPosition });
        setNewPosition({ title: 'President', yearAppointed: '', yearResigned: '' });
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">2. සාමාජිකත්ව ඉතිහාසය (Membership History)</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">බැඳුනු දිනය (Date Joined)</label>
                    <input
                        type="date"
                        name="joinedDate"
                        value={membership.joinedDate}
                        onChange={handleMembershipChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">සාමාජික අංකය (Member No)</label>
                    <input
                        type="number"
                        name="membershipNo"
                        value={membership.membershipNo}
                        onChange={handleMembershipChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">කලාපය (Zone)</label>
                    <select
                        name="zone"
                        value={membership.zone}
                        onChange={handleMembershipChange}
                        className="input-field"
                    >
                        <option value="">Select Zone...</option>
                        <option value="A">Zone A</option>
                        <option value="B">Zone B</option>
                        <option value="C">Zone C</option>
                    </select>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Positions Held (ධුරයන්)</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-600">තනතුර (Position)</label>
                            <select
                                value={newPosition.title}
                                onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                                className="input-field"
                            >
                                <option value="President">සභාපති (President)</option>
                                <option value="Secretary">ලේකම් (Secretary)</option>
                                <option value="Treasurer">භාණ්ඩාගාරික (Treasurer)</option>
                                <option value="Technician">තාක්ෂණධාරී (Technician)</option>
                                <option value="Member">කාරක සභික (Committee Member)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600"> පත් වූ වර්ෂය (Year Appointed)</label>
                            <input
                                type="number"
                                placeholder="YYYY"
                                value={newPosition.yearAppointed}
                                onChange={(e) => setNewPosition({ ...newPosition, yearAppointed: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600"> ඉල්ලා අස්වූ වර්ෂය (Year Resigned)</label>
                            <input
                                type="number"
                                placeholder="YYYY (Optional)"
                                value={newPosition.yearResigned}
                                onChange={(e) => setNewPosition({ ...newPosition, yearResigned: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={addPosition}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Position
                            </button>
                        </div>
                    </div>
                </div>

                {/* List of positions */}
                {positions.length > 0 && (
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-2 pl-3 text-left text-xs font-semibold text-gray-900">Position</th>
                                    <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Year Appointed</th>
                                    <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Resigned/Term End</th>
                                    <th scope="col" className="relative py-2 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {positions.map((pos, idx) => (
                                    <tr key={idx}>
                                        <td className="whitespace-nowrap py-2 pl-3 text-sm font-medium text-gray-900">{pos.title}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{pos.yearAppointed}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{pos.yearResigned || '-'}</td>
                                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <button
                                                type="button"
                                                onClick={() => dispatch({ type: 'REMOVE_POSITION', payload: idx })}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step2Membership;
