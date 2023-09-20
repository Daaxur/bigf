import React from 'react';

const Logout = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Redirigez l'utilisateur vers la page de connexion
        window.location.href = '/';
      } else {
        console.log('Logout failed'); // Gérer l'échec de la déconnexion
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <button type="button" className="btn btn-outline-warning" onClick={handleLogout}>
        Logout
      </button>
    </form>
  );
};

export default Logout;
