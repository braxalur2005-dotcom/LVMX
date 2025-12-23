function TeamEditModal({ team, onSave, onClose }) {
  try {
    const [name, setName] = React.useState(team.name);
    const [titles, setTitles] = React.useState(team.titles);
    const [logoUrl, setLogoUrl] = React.useState(team.logoUrl || '');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        ...team,
        name,
        titles: parseInt(titles),
        logoUrl
      });
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Editar Equipo</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <div className="icon-x text-2xl"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Nombre del Equipo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Número de Títulos</label>
              <input
                type="number"
                value={titles}
                onChange={(e) => setTitles(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Escudo del Equipo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">O ingresa una URL de imagen:</p>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://ejemplo.com/escudo.png"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] mt-2"
              />
            </div>

            {logoUrl && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Vista Previa:</p>
                <img src={logoUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto" />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)]"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TeamEditModal error:', error);
    return null;
  }
}