import React from 'react';

/**
 * Memory Game (Open Source, MIT License)
 * Источник: https://github.com/igameproject/Memory-Game
 * Автор: Indian Game Project
 */

const GAME_URL = '/memory/index.html';

const MemoryGame = ({ onExit }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingBottom: 40
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 18,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      padding: '32px 32px 24px 32px',
      maxWidth: 1280,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      {onExit && <button onClick={onExit} className="control-button exit" style={{ position: 'absolute', top: 24, right: 24, fontSize: 18, background: '#f87171', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Выйти</button>}
      <h2 style={{
        fontSize: 36,
        fontWeight: 800,
        color: '#3730a3',
        marginBottom: 12,
        letterSpacing: 1
      }}>Memory Game <span style={{fontWeight:400, fontSize: 22, color:'#6366f1'}}>(Open Source)</span></h2>
      <div style={{
        fontSize: 20,
        color: '#334155',
        marginBottom: 24,
        textAlign: 'center',
        maxWidth: 900
      }}>
        <strong>Описание:</strong> Классическая игра на запоминание пар. Открывайте карточки и находите совпадения. Работает прямо в браузере.
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24
      }}>
        <iframe
          src={GAME_URL}
          title="Memory Game"
          width="900"
          height="900"
          allowFullScreen
          style={{ border: '3px solid #6366f1', borderRadius: '14px', background: '#f1f5f9', boxShadow: '0 4px 32px 0 rgba(99,102,241,0.10)' }}
        />
      </div>
      <div style={{
        fontSize: 18,
        color: '#475569',
        textAlign: 'center',
        marginTop: 8
      }}>
        <strong>Источник:</strong> <a href="https://github.com/igameproject/Memory-Game" target="_blank" rel="noopener noreferrer" style={{color:'#6366f1', textDecoration:'underline'}}>github.com/igameproject/Memory-Game</a> (MIT License)
      </div>
    </div>
  </div>
);

export default MemoryGame;