import React from 'react';
import { JobApplication } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import JobApplicationView from './JobApplicationView';
import '@/styles/component-view.css';

interface JobApplicationListViewProps {
  jobApplications: JobApplication[];
}

const JobApplicationListView: React.FC<JobApplicationListViewProps> = ({ jobApplications }) => {
  return (
    <div className="view-container">
      <h3 className="view-title">지원 기록</h3>
      
      {!jobApplications || jobApplications.length === 0 ? (
        <EmptyState text="등록된 지원 기록이 없습니다." />
      ) : (
        <div className="view-list-container">
          {jobApplications.map((app, appIndex) => (
            <JobApplicationView 
              key={app.id || `app-${appIndex}`}
              jobApplication={app}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicationListView;

