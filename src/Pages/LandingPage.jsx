import { textAlign } from '@mui/system';
import React from 'react';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome To Inter Company Billing</h1>
      {/* <div style={styles.thinLine} /> */}
      {/* <p style={styles.subtitle}>Manage your intercompany transactions easily</p> */}
      <img src="/files/assets/images/ITSALOGO.png" alt="Logo" style={styles.landingimage} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
 title: {
  textAlign :'center',
  // marginLeft: '200px',
  fontSize: '3rem',
  color: '#333',
  marginBottom: '10px'
},
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '20px',
    textAlign: 'center',
  },
  landingimage: {
    width: '300px', 
    textAlign :'center', // Constrain size to look like a logo
    objectFit: 'contain',
  },
  thinLine: {
    width: '60%',
    borderBottom: '1px solid #ccc',
    marginBottom: '15px',
  },
};

export default LandingPage;
