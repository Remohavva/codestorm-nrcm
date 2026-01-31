import { cn } from '@/lib/utils';

export default function GlassCard({ children, className = '', onClick, clickable = false }) {
  return (
    <div 
      className={cn(
        'bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl transition-all duration-300',
        'hover:border-gray-500/50 hover:shadow-2xl hover:shadow-white/5',
        clickable && 'cursor-pointer hover:transform hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}