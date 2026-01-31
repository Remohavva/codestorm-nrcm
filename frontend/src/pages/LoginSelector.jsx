import { Link } from 'react-router-dom';
import { HiAcademicCap, HiUserGroup, HiArrowRight } from 'react-icons/hi';
import Beams from '../components/Beams';
import './LoginSelector.css';

function LoginSelector() {
  return (
    <div className="login-selector-page">
      {/* Beams Background */}
      <div className="beams-background">
        <Beams
          beamWidth={2}
          beamHeight={25}
          beamNumber={15}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={1.5}
          scale={0.15}
          rotation={45}
        />
      </div>

      <div className="selector-container">
        <div className="selector-header">
          <h1>CampusHub</h1>
          <p>Select your login type</p>
        </div>

        <div className="selector-options">
          <Link to="/login/student" className="selector-card student-card">
            <div className="card-icon">
              <HiAcademicCap size={32} />
            </div>
            <h2>Student</h2>
            <p>Access events and clubs</p>
            <div className="card-arrow">
              <HiArrowRight size={20} />
            </div>
          </Link>

          <Link to="/login/coordinator" className="selector-card coordinator-card">
            <div className="card-icon">
              <HiUserGroup size={32} />
            </div>
            <h2>Club Coordinator</h2>
            <p>Manage events and members</p>
            <div className="card-arrow">
              <HiArrowRight size={20} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginSelector;
