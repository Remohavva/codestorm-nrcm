import Beams from './Beams';

// Example usage of the Beams component with different configurations
const BeamsExample = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#000' }}>
      <Beams
        beamWidth={3}
        beamHeight={30}
        beamNumber={20}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textAlign: 'center',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '2rem',
        borderRadius: '10px'
      }}>
        <h2>Beams Background</h2>
        <p>Animated light beams with customizable properties</p>
      </div>
    </div>
  );
};

export default BeamsExample;