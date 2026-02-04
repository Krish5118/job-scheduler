import React, { useState } from 'react';
import { createJob } from '../services/api';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

const JobForm = ({ onJobCreated }) => {
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [payload, setPayload] = useState('{}');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            // Validate JSON
            let parsedPayload;
            try {
                parsedPayload = JSON.parse(payload);
            } catch (err) {
                setStatus({ type: 'error', message: 'Invalid JSON payload format' });
                return;
            }

            if (!taskName.trim()) {
                setStatus({ type: 'error', message: 'Task Name is required' });
                return;
            }

            await createJob({ taskName, priority, payload: parsedPayload });

            setTaskName('');
            setPriority('Medium');
            setPayload('{}');
            setStatus({ type: 'success', message: 'Job created successfully!' });

            if (onJobCreated) onJobCreated();

            // Clear success message after 3s
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to create job. Server error.';
            setStatus({ type: 'error', message: errorMsg });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Plus size={18} className="text-indigo-600" />
                    New Job
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {status.message && (
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                        }`}>
                        {status.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                        {status.message}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Task Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Weekly Report Generation"
                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors p-2.5 text-sm"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Low', 'Medium', 'High'].map((p) => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`text-sm py-2 rounded-lg border transition-all ${priority === p
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Payload (JSON)</label>
                    <textarea
                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors p-2.5 text-sm font-mono text-slate-700 h-32 resize-none"
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                    ></textarea>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        Create Job
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobForm;
