import React, { useEffect, useState } from 'react';
import { getJobs, runJob } from '../services/api';
import { Link } from 'react-router-dom';
import { Play, PlayCircle, Eye, RefreshCw, Filter, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [runningId, setRunningId] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (statusFilter) filters.status = statusFilter;
            if (priorityFilter) filters.priority = priorityFilter;

            const response = await getJobs(filters);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, [statusFilter, priorityFilter]);

    const handleRunJob = async (id, e) => {
        e.preventDefault();
        setRunningId(id);
        try {
            await runJob(id);
            await fetchJobs();
        } catch (error) {
            console.error('Error running job:', error);
            alert('Failed to start job');
        } finally {
            setRunningId(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            running: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
            failed: 'bg-red-100 text-red-800 border-red-200',
            pending: 'bg-slate-100 text-slate-800 border-slate-200'
        };
        const icons = {
            completed: <CheckCircle2 size={12} className="mr-1" />,
            running: <RefreshCw size={12} className="mr-1 animate-spin" />,
            failed: <AlertOctagon size={12} className="mr-1" />,
            pending: <Clock size={12} className="mr-1" />
        };

        return (
            <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-full border ${styles[status] || styles.pending}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800">Job Queue</h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Filter className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                        <select
                            className="pl-8 pr-8 py-2 border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="running">Running</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <Link to={`/jobs/${job.id}`} className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors">
                                            {job.taskName}
                                        </Link>
                                        <span className="text-xs text-slate-400">ID: #{job.id} • {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 
                                        ${job.priority === 'High' ? 'bg-orange-500' :
                                            job.priority === 'Low' ? 'bg-slate-400' : 'bg-blue-500'}`}>
                                    </span>
                                    <span className="text-sm text-slate-700">{job.priority}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={job.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        {job.status === 'pending' && (
                                            <button
                                                onClick={(e) => handleRunJob(job.id, e)}
                                                disabled={runningId === job.id}
                                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-50"
                                                title="Run Job"
                                            >
                                                {runningId === job.id ? <RefreshCw size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                                            </button>
                                        )}
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs.length === 0 && !loading && (
                    <div className="p-12 text-center flex flex-col items-center text-slate-400">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <Clock size={32} />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No jobs yet</p>
                        <p className="text-sm">Create a new job to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobList;
