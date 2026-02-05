import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [members, setMembers] = useState([]);
    const [lifeMemberPeriod, setLifeMemberPeriod] = useState('20');
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [membersRes, settingsRes] = await Promise.all([
                fetch('http://localhost:3001/api/members'),
                fetch('http://localhost:3001/api/settings')
            ]);

            const membersData = await membersRes.json();
            const settingsData = await settingsRes.json();

            setMembers(membersData);
            setLifeMemberPeriod(settingsData.life_member_period || '20');
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsSave = async () => {
        try {
            await fetch('http://localhost:3001/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ life_member_period: lifeMemberPeriod })
            });
            setSaveStatus('Saved!');
            setTimeout(() => setSaveStatus(null), 2000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setSaveStatus('Error saving');
        }
    };

    // Helper: Calculate if member is Life Member dynamically
    const isLifeMember = (joinedDate) => {
        if (!joinedDate) return false;
        const joined = new Date(joinedDate);
        const today = new Date();
        const diffYears = (today - joined) / (1000 * 60 * 60 * 24 * 365.25);
        return diffYears >= parseInt(lifeMemberPeriod);
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            {/* Print Header (Visible only on print) */}
            <div className="hidden print:block text-center mb-8">
                <h1 className="text-4xl font-bold">Polwatta Death Donation Society</h1>
                <p className="text-xl mt-2">Member Report - {new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex justify-between items-center mb-8 print:hidden">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <button onClick={() => {
                    localStorage.removeItem('isAuthenticated');
                    window.location.href = '/admin';
                }} className="text-red-600 underline text-sm">Logout</button>
            </div>

            {/* Settings Section (Hidden in Print) */}
            <div className="card mb-8 border-l-4 border-brand-500 print:hidden">
                <h2 className="section-title">Settings</h2>
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                        Life Membership Eligibility Period (Values):
                    </label>
                    <select
                        value={lifeMemberPeriod}
                        onChange={(e) => setLifeMemberPeriod(e.target.value)}
                        className="input-field w-32"
                    >
                        <option value="10">10 Years</option>
                        <option value="15">15 Years</option>
                        <option value="20">20 Years</option>
                        <option value="25">25 Years</option>
                    </select>
                    <button
                        onClick={handleSettingsSave}
                        className="btn-primary"
                    >
                        Save Settings
                    </button>
                    {saveStatus && <span className="text-green-600 font-medium">{saveStatus}</span>}
                </div>
            </div>

            {/* Members Table */}
            <div className="card print:shadow-none print:border-none">
                <div className="flex justify-between items-center mb-4 print:hidden">
                    <h2 className="section-title mb-0">Registered Members ({members.length})</h2>
                    <div className="space-x-2">
                        <button onClick={handlePrint} className="btn-primary bg-green-600 hover:bg-green-700">
                            🖨️ Print PDF Report
                        </button>
                        <button onClick={fetchData} className="btn-secondary text-sm">Refresh</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 print:divide-gray-400">
                        <thead className="bg-gray-50 print:bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">NIC</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">Member No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">Joined Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 print:divide-gray-300">
                            {members.map((member) => {
                                const lifeMember = isLifeMember(member.joined_date);
                                return (
                                    <tr key={member.id} className="print:text-sm">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:text-black">#{member.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 print:text-black">{member.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:text-black">{member.nic}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:text-black">{member.membership_no || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:text-black">{member.joined_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 print:text-black">
                                            {lifeMember ?
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Life Member</span> :
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Active</span>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No members registered yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
