const AuthManager = {
  register(username, password) {
    const users = JSON.parse(localStorage.getItem('lvmx_users') || '[]');
    
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return { success: false, message: 'El nombre de usuario ya existe' };
    }

    if (password.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('lvmx_users', JSON.stringify(users));
    
    localStorage.setItem('lvmx_currentUser', JSON.stringify({
      id: newUser.id,
      username: newUser.username
    }));

    return { success: true, message: 'Registro exitoso' };
  },

  login(username, password) {
    const users = JSON.parse(localStorage.getItem('lvmx_users') || '[]');
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Usuario o contraseña incorrectos' };
    }

    localStorage.setItem('lvmx_currentUser', JSON.stringify({
      id: user.id,
      username: user.username
    }));

    return { success: true, message: 'Inicio de sesión exitoso' };
  },

  logout() {
    localStorage.removeItem('lvmx_currentUser');
    window.location.href = 'login.html';
  },

  getCurrentUser() {
    const user = localStorage.getItem('lvmx_currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};