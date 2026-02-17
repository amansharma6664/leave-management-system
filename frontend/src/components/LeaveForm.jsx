import React, { useState } from 'react';
import { employeeAPI } from '../services/api';
import './LeaveForm.css';

const LeaveForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'CASUAL_LEAVE',
    reason: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    { value: 'SICK_LEAVE', label: 'Sick Leave' },
    { value: 'CASUAL_LEAVE', label: 'Casual Leave' },
    { value: 'ANNUAL_LEAVE', label: 'Annual Leave' },
    { value: 'MATERNITY_LEAVE', label: 'Maternity Leave' },
    { value: 'PATERNITY_LEAVE', label: 'Paternity Leave' },
    { value: 'UNPAID_LEAVE', label: 'Unpaid Leave' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      await employeeAPI.applyLeave(formData);
      setFormData({
        startDate: '',
        endDate: '',
        leaveType: 'CASUAL_LEAVE',
        reason: '',
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="leave-form">
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date *</label>
          <input
            type="date"
            name="startDate"
            className="form-input"
            value={formData.startDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Date *</label>
          <input
            type="date"
            name="endDate"
            className="form-input"
            value={formData.endDate}
            onChange={handleChange}
            required
            min={formData.startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Leave Type *</label>
        <select
          name="leaveType"
          className="form-select"
          value={formData.leaveType}
          onChange={handleChange}
          required
        >
          {leaveTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Reason</label>
        <textarea
          name="reason"
          className="form-textarea"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Please provide a reason for your leave request..."
          rows="4"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </div>
    </form>
  );
};

export default LeaveForm;
