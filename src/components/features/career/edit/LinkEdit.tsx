import React, { useState } from 'react';
import { Link } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';

interface LinkEditProps {
  link: Link;
  onUpdate: (updatedLink: Link) => void;
  onCancel: () => void;
}

const LinkEdit: React.FC<LinkEditProps> = ({ link, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    url: link.url,
    isVisible: link.isVisible,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 업데이트된 데이터를 상위 컴포넌트로 전달
        const updatedLink: Link = {
          ...link,
          ...formData
        };
        onUpdate(updatedLink);
      } else {
        console.error('Failed to update link');
      }
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
        링크 정보 수정
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            URL <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
            placeholder="https://example.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ 
                ...formData, 
                isVisible: e.target.checked
              })}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontSize: '14px' }}>공개 표시</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#fff',
              color: '#333',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#2196f3',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default LinkEdit;
