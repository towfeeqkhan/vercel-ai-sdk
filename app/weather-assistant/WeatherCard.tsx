type WeatherData = {
  city: string;
  region: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  lastUpdated: string;
};

type WeatherCardProps = {
  weather: WeatherData;
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="mt-6 w-full max-w-md rounded-2xl border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{weather.city}</h2>

        <p className="text-gray-500">
          {weather.region}, {weather.country}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-5xl font-bold">{weather.temperature}°C</p>

        <p className="mt-2 text-lg">{weather.condition}</p>

        <p className="text-sm text-gray-500">
          Feels like {weather.feelsLike}°C
        </p>
      </div>

      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between">
          <span>Humidity</span>
          <span>{weather.humidity}%</span>
        </div>

        <div className="flex justify-between">
          <span>Wind</span>
          <span>{weather.windSpeed} km/h</span>
        </div>

        <div className="flex justify-between">
          <span>Updated</span>
          <span>{weather.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
