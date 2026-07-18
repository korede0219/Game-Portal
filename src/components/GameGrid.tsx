import { Game } from '../types';
import { GameTile } from './GameTile';

interface GameGridProps {
  games: Game[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  title: string;
  indexOffset?: number;
}

export function GameGrid({ games, selectedId, onSelect, title, indexOffset = 0 }: GameGridProps) {
  return (
    <div className="px-8 mt-14">
      <h2 className="text-[#6a6a75] text-[11px] font-bold uppercase tracking-[1.5px] mb-6">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-6">
        {games.map((game, idx) => (
          <GameTile 
            key={game.id} 
            game={game} 
            isSelected={selectedId === game.id} 
            onSelect={() => onSelect(game.id)}
            index={indexOffset + idx} 
          />
        ))}
      </div>
    </div>
  );
}
