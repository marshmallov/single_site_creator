function BackgroundImageSelector({ section, label, value, onChange, images = {} }) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-white">{label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(`${section}.backgroundImage`, e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">Select an image</option>
          {Object.entries(images).map(([key, path]) => (
            <option key={key} value={path}>
              {key} ({path})
            </option>
          ))}
        </select>
  
        {value && (
          <img
            src={value}
            alt={`Selected ${section} Background`}
            className="mt-2 h-32 object-cover rounded border"
          />
        )}
      </div>
    );
  }

  export default BackgroundImageSelector;