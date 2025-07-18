function ServiceImageSelector({ services = {}, images = {}, onChange }) {
  const items = Array.isArray(services.items) ? services.items : [];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-black">Service Item Background Images</h2>
      {items.map((item, index) => (
        <div key={index} className="mb-6">
          <label className="block text-sm font-medium mb-2 text-black">
            Background for {item.title}
          </label>
          <select
            value={item.backgroundImage || ''}
            onChange={(e) =>
              onChange(`services.items.${index}.backgroundImage`, e.target.value)
            }
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Select an image</option>
            {Object.entries(images).map(([key, path]) => (
              <option key={key} value={path}>
                {key} ({path})
              </option>
            ))}
          </select>

          {item.backgroundImage && (
            <img
              src={item.backgroundImage}
              alt={`Service ${index} Preview`}
              className="mt-2 h-32 object-cover rounded border"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ServiceImageSelector;
