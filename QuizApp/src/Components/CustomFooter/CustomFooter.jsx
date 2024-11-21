import React from 'react';
import { CDBBox, CDBContainer } from 'cdbreact';

function CustomFooter() {
  return (
    <footer
      style={{
        background: 'linear-gradient(to right, #f7a7b6, #c2a3f1)',
        color: '#fff',
        paddingTop: '30px',
        paddingBottom: '30px',
        boxShadow: '0px -10px 40px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        marginTop:'40px', 
      }}
      className="shadow"
    >
      <CDBContainer >
        <CDBBox display="flex" justifyContent="between" className="flex-wrap">
          <CDBBox style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
            <h5 className="text-white mb-4">About Our Quiz App</h5>
            <p className="text-white" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Test your knowledge and challenge yourself with a variety of quizzes. Track your progress and improve your skills across multiple subjects and topics. Perfect for students, professionals, or anyone looking to have fun while learning.
            </p>
          </CDBBox>

          <CDBBox style={{ width: '100%', maxWidth: '200px', marginBottom: '20px'}}>
            <h5 className="text-white mb-4">Quiz Categories</h5>
            <ul className="text-white" style={{ listStyleType: 'none', paddingLeft: 0 }}>
              <li>🧠 General Knowledge</li>
              <li>🔬 Science & Technology</li>
              <li>📚 History & Geography</li>
              <li>🎬 Movies & TV</li>
              <li>💼 Business & Finance</li>
            </ul>
          </CDBBox>

          <CDBBox style={{ width: '100%', maxWidth: '200px', marginBottom: '20px' }}>
            <h5 className="text-white mb-4">Popular Topics</h5>
            <ul className="text-white" style={{ listStyleType: 'none', paddingLeft: 0 }}>
              <li>📖 Data Structures</li>
              <li>⚡ Electrical Engineering</li>
              <li>🌍 World History</li>
              <li>💡 Artificial Intelligence</li>
              <li>🍴 Culinary Arts</li>
            </ul>
          </CDBBox>

          <CDBBox style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
            <h5 className="text-white mb-4">What Our Users Say</h5>
            <p className="text-white" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              "The quizzes are challenging and fun! I love the variety of topics and the instant feedback." - Jane D.
            </p>
            <p className="text-white" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              "Great platform for learning and testing my knowledge. The detailed analysis of scores is very helpful." - John P.
            </p>
          </CDBBox>
        </CDBBox>

        <CDBBox display="flex" justifyContent="center" className="mt-3">
          <CDBBox display="flex" className="footer-links">
            <a href="/" className="text-white py-2 px-3 mx-2" style={{ fontSize: '14px' }}>
              About Us
            </a>
            <a href="/" className="text-white py-2 px-3 mx-2" style={{ fontSize: '14px' }}>
              Contact
            </a>
            <a href="/" className="text-white py-2 px-3 mx-2" style={{ fontSize: '14px' }}>
              Privacy Policy
            </a>
          </CDBBox>
        </CDBBox>

        <small
          className="text-center mt-3"
          style={{
            display: 'block',
            color: '#dcdcdc',
            fontSize: '14px',
            opacity: '0.7',
          }}
        >
          &copy; Quiz System, 2024 | All rights reserved.
        </small>
      </CDBContainer>
    </footer>
  );
}

export default CustomFooter;
