import React, { useState, useEffect } from 'react';
import { getGames, updateGame } from '../../utils/api';

const GamesManager = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await getGames();
      setGames(data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке игр');
      setLoading(false);
    }
  };

  const toggleGameAccess = async (game) => {
    try {
      await updateGame(game.id, {
        ...game,
        isActive: !game.isActive
      });
      fetchGames();
    } catch (err) {
      setError('Ошибка при изменении доступа к игре');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Управление доступом к играм</h2>
      
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {games.map(game => (
          <div key={game.id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>
              {game.icon || '🎮'}
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>{game.title}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>{game.description}</p>
            <div style={{ 
              marginBottom: '15px',
              padding: '5px 10px',
              borderRadius: '4px',
              backgroundColor: game.isActive ? '#f0fdf4' : '#fef2f2',
              color: game.isActive ? '#15803d' : '#b91c1c',
              display: 'inline-block'
            }}>
              {game.isActive ? 'Доступна' : 'Недоступна'}
            </div>
            <div>
              <button 
                onClick={() => toggleGameAccess(game)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: game.isActive ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {game.isActive ? 'Закрыть доступ' : 'Открыть доступ'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesManager;