function Header() {
  try {
    const [isDark, setIsDark] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);

    React.useEffect(() => {
      const theme = localStorage.getItem('theme') || 'light';
      setIsDark(theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme);
      
      if (typeof AuthManager !== 'undefined') {
        setCurrentUser(AuthManager.getCurrentUser());
      }
    }, []);

    const toggleTheme = () => {
      const newTheme = isDark ? 'light' : 'dark';
      setIsDark(!isDark);
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
      if (typeof AuthManager !== 'undefined') {
        AuthManager.logout();
      }
    };

    return (
      <header className="bg-[var(--secondary-color)] text-white shadow-lg" data-name="header" data-file="components/Header.js">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="index.html" className="flex items-center gap-3">
              <img 
                src="https://app.trickle.so/storage/public/images/usr_1836b178a0000001/b7dc1fa3-dd23-4df6-afef-f76b64b24908.x-icon" 
                alt="LVMX Logo" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold">Ligas Virtuales MX</h1>
                <p className="text-xs text-gray-300">Sistema Profesional</p>
              </div>
            </a>
            <nav className="flex items-center gap-6">
              <a href="index.html" className="hover:text-[var(--primary-color)] transition-colors">Inicio</a>
              {currentUser ? (
                <>
                  <span className="text-sm">Hola, {currentUser.username}</span>
                  {currentUser.isAdmin && (
                    <a href="admin.html" className="hover:text-[var(--primary-color)] transition-colors">Panel Admin</a>
                  )}
                  <button onClick={handleLogout} className="hover:text-[var(--primary-color)] transition-colors">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <a href="login.html" className="hover:text-[var(--primary-color)] transition-colors">Iniciar Sesión</a>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
              >
                <div className={`${isDark ? 'icon-sun' : 'icon-moon'} text-xl`}></div>
              </button>
            </nav>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header error:', error);
    return null;
  }
}