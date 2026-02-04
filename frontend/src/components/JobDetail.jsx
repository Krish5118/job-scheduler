import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/api';
import { ArrowLeft, Calendar, FileJson, Tag, Activity } from 'lucide-react';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await getJobById(id);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!job) return <div className="text-center p-8 text-slate-500">Job not found</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'failed': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {job.taskName}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                            Job ID: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">#{job.id}</span>
                        </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(job.status)} uppercase tracking-wider`}>
                        {job.status}
                    </span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Tag size={14} /> Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Priority</span>
                                    <span className={`font-medium ${job.priority === 'High' ? 'text-orange-600' : 'text-slate-700'
                                        }`}>{job.priority}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Status</span>
                                    <span className="font-medium text-slate-700 capitalize">{job.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Calendar size={14} /> Timeline
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Created At</span>
                                    <span className="text-slate-700 font-mono text-xs">{new Date(job.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Completed At</span>
                                    <span className="text-slate-700 font-mono text-xs">
                                        {job.completedAt ? new Date(job.completedAt).toLocaleString() : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 flex flex-col">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileJson size={14} /> Payload
                        </h3>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                                {typeof job.payload === 'string' ?
                                    JSON.stringify(JSON.parse(job.payload), null, 2) :
                                    JSON.stringify(job.payload, null, 2)
                                }
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
