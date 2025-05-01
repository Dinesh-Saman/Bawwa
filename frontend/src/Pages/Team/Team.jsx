import React from 'react';
import './Team.css';
import { FaFacebook, FaLinkedinIn, FaGoogle } from 'react-icons/fa';

// Import images
import hrmanImg from "../../assets/hrman.png";
import vetImg from "../../assets/vet.png";
import vetnurseImg from "../../assets/vetnurse.png";
import mobilevetImg from "../../assets/mobilevet.png";
import managerImg from "../../assets/manager.png";
import vetdocImg from "../../assets/vetdoc.png";

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'BEN FRANKFURT',
      position: 'Lead Engineer',
      image: hrmanImg,
      socialLinks: {
        facebook: '#',
        linkedin: '#',
        google: '#'
      }
    },
    {
      id: 2,
      name: 'GLORIA FLECK',
      position: 'Finance Director',
      image: vetImg,
      socialLinks: {
        facebook: '#',
        linkedin: '#',
        google: '#'
      }
    },
    {
      id: 3,
      name: 'REBECCA MILLS',
      position: 'Legal Counsel',
      image: vetnurseImg,
      socialLinks: {
        facebook: '#',
        linkedin: '#',
        google: '#'
      }
    },
    {
      id: 4,
      name: 'DAN SLOAN',
      position: 'Marketing Head',
      image: mobilevetImg,
      socialLinks: {
        facebook: '#',
        linkedin: '#',
        google: '#'
      }
    },
    {
      id: 5,
      name: 'CHRIS TROVE',
      position: 'Development Lead',
      image: managerImg,
      socialLinks: {
        facebook: '#',
        linkedin: '#',
        google: '#'
      }
    },
    {
      id: 6,
      name: 'RACHEL FLEET',
      position: 'Sales Director',
      image: vetdocImg,
      socialLinks: {
        facebook: '#',
        linkedin: '#',
        google: '#'
      }
    }
  ];

  return (
    <section className="team-section">
      <div className="team-container">
        <div className="team-header">
          <h2 className="team-subtitle">Meet Our Experts</h2>
          <h1 className="team-title">Our <span>Talented</span> Team</h1>
          <div className="divider"></div>
          <p className="team-description">
            Dedicated professionals committed to excellence in pet care
          </p>
        </div>
        
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="card-image">
                <img src={member.image} alt={member.name} />
                <div className="image-overlay"></div>
              </div>
              
              <div className="card-content">
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="position">{member.position}</p>
                  <p className="bio">
                    Specializing in pet health and wellness with over 5 years of experience.
                  </p>
                </div>
                
                <div className="social-links">
                  <a href={member.socialLinks.facebook} aria-label="Facebook">
                    <FaFacebook className="social-icon" />
                  </a>
                  <a href={member.socialLinks.linkedin} aria-label="LinkedIn">
                    <FaLinkedinIn className="social-icon" />
                  </a>
                  <a href={member.socialLinks.google} aria-label="Google">
                    <FaGoogle className="social-icon" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;