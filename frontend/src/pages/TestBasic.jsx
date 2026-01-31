function TestBasic() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Basic Test Page</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '1rem', 
        borderRadius: '8px',
        marginTop: '1rem'
      }}>
        <h2>System Check:</h2>
        <ul>
          <li>✅ React is rendering</li>
          <li>✅ CSS is working</li>
          <li>✅ JavaScript is working</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
}

export default TestBasic;