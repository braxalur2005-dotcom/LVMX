function LoginApp() {
  try {
    const [isLogin, setIsLogin] = React.useState(true);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!username || !password) {
        setMessage('Por favor completa todos los campos');
        return;
      }

      if (isLogin) {
        const result = AuthManager.login(username, password);
        if (result.success) {
          setMessage('Inicio de sesión exitoso');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          setMessage(result.message);
        }
      } else {
        const result = AuthManager.register(username, password);
        if (result.success) {
          setMessage('Registro exitoso. Iniciando sesión...');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          setMessage(result.message);
        }
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-6">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </h1>
            
            {message && (
              <div className={`mb-4 px-4 py-3 rounded ${
                message.includes('exitoso') 
                  ? 'bg-green-100 text-green-700 border border-green-400' 
                  : 'bg-red-100 text-red-700 border border-red-400'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Nombre de Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  placeholder="Tu nombre de usuario"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  placeholder="Tu contraseña"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--secondary-color)] transition-colors"
              >
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                  setUsername('');
                  setPassword('');
                }}
                className="text-[var(--primary-color)] hover:underline"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t">
              <a 
                href="admin.html" 
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-[var(--primary-color)] transition-colors"
              >
                <div className="icon-shield text-lg"></div>
                Acceso de Administrador
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('LoginApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);