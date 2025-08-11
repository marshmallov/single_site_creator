function BackgroundVideoSelector({ section, label, value, onChange, videos = {} }) {
    return (
      <div className="grid grid-cols-[150px_1fr_auto] mb-6">
        <label className="block text-sm font-medium mb-2 text-black">{label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(`${section}.backgroundVideo`, e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black "
        >
          <option value="">Select a video</option>
          {Object.entries(videos).map(([key, path]) => (
            <option key={key} value={path}>
              {key} ({path})
            </option>
          ))}
        </select>
  
        {value && (
          <video
            src={value}
            className="mt-2 h-32 object-cover rounded border"
            autoPlay
            loop
            muted
          />
        )}
      </div>
    );
  }
  export default BackgroundVideoSelector;
  