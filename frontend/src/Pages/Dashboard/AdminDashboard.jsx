import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const DashboardHeader = styled.header`
  background-color: blue;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
`;

const BackIcon = styled.svg`
  width: 24px;
  height: 24px;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  flex-grow: 1;
  text-align: center;
  color: white;
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AdminName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: white;
  color: blue;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const DashboardTitle = styled.h2`
  font-family: 'Arial', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: #6a0dad;
  text-align: center;
  margin: 2rem 0;
`;

const CardsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-top: 50px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  width: 25%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const systems = [
    {
      title: 'User and Pet Management',
      image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      path: '/admin',
    },
    {
      title: 'Schedule and Reminder',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      path: '/booknow',
    },
    {
      title: 'Nutrition Management',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      path: '/NutritionManagement',
    },
    {
      title: '3D Pet Accessories',
      image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      path: '/AdminDashboard',
    },
  ];

  const handleLogout = () => {
    // Clear admin status and navigate to home
    localStorage.setItem('isAdmin', 'false');
    localStorage.removeItem('userEmail'); // Optional: clear email too
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <BackButton onClick={handleBack}>
          <BackIcon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </BackIcon>
        </BackButton>
        <HeaderTitle>Admin Dashboard</HeaderTitle>
        <AdminInfo>
          <AdminName>Admin User</AdminName>
          <LogoutButton onClick={handleLogout}>  
            Logout
          </LogoutButton>
        </AdminInfo>
      </DashboardHeader>

      <DashboardTitle>Management Systems</DashboardTitle>
      
      <CardsRow>
        {systems.map((system, index) => (
          <Card key={index} onClick={() => navigate(system.path)}>
            <CardImage>
              <img src={system.image} alt={system.title} />
            </CardImage>
            <CardTitle>{system.title}</CardTitle>
          </Card>
        ))}
      </CardsRow>
    </DashboardContainer>
  );
};

export default AdminDashboard;