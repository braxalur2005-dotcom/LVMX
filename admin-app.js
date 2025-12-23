function AdminApp() {
  try {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [password, setPassword] = React.useState('');

    React.useEffect(() => {
      const adminSession = localStorage.getItem('lvmx_adminSession');
      if (adminSession) {
        setIsAuthenticated(true);
      }
    }, []);

    const handleLogin = (e) => {
      e.preventDefault();
      if (password === 'admin123') {
        localStorage.setItem('lvmx_adminSession', 'true');
        const currentUser = AuthManager.getCurrentUser();
        if (currentUser) {
          localStorage.setItem('lvmx_currentUser', JSON.stringify({
            ...currentUser,
            isAdmin: true
          }));
        }
        setIsAuthenticated(true);
      } else {
        alert('Contraseña incorrecta');
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('lvmx_adminSession');
      const currentUser = AuthManager.getCurrentUser();
      if (currentUser) {
        delete currentUser.isAdmin;
        localStorage.setItem('lvmx_currentUser', JSON.stringify(currentUser));
      }
      window.location.href = 'index.html';
    };

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6 text-center">Panel de Administración</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  placeholder="admin123"
                />
              </div>
              <button type="submit" className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--secondary-color)]">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-2">Gestión de temporadas y simulaciones</p>
            </div>
            <div className="flex gap-4">
              <a href="index.html" className="text-[var(--primary-color)] hover:underline">
                ← Volver a Inicio
              </a>
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Cerrar Sesión Admin
              </button>
            </div>
          </div>
          <AdminControls />
        </main>
      </div>
    );
  } catch (error) {
    console.error('AdminApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);