interface CountryCardProps {
  country: string;
  count: number;
  flag: string;
  percentage: number;
  rank?: number;
}

export default function CountryCard({ country, count, flag, percentage, rank }: CountryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-xl">
            {flag}
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-white text-sm block">
              {country}
            </span>
            {rank && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Rank #{rank}
              </span>
            )}
          </div>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {count}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="text-right">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
