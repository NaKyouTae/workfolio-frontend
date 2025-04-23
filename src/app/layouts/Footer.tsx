import React from 'react';
import '@/styles/footer.css';
const Footer = () => {return (
        <div className="footer-container">
            <div>고객센터</div>
            <div style={{ margin: '0 8px' }}>|</div>
            <div>이용약관</div>
            <div style={{ margin: '0 8px' }}>|</div>
            <div>개인정보처리방침</div>
        </div>
    );
};

export default Footer;
