function SingleImageSelector({ section, label, value, onChange, images }) {
  return (
    <div className="grid grid-cols-[150px_1fr_auto]">
      <label className="text-sm font-medium mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(`${section}.image`, e.target.value)}
        className="w-full h-min px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black bg-gray-300">
        <option value="">Select an image</option>
        {Object.entries(images || {}).map(([key, path]) => (
          <option key={key} value={path}>
            {key} ({path})
          </option>
        ))}
      </select>

      {value && (
        <img
          src={value}
          alt={`${section} image`}
          className="mt-2 h-32 object-cover rounded border"
        />
      )}
    </div>
  );
}

export default SingleImageSelector;