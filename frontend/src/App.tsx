import React, { useState, useEffect } from 'react';

interface KnowledgeRecord {
  id: string;
  ipfsHash: string;
  communityLead: string;
  communityId: string;
  timestamp: string;
}

function App() {
  const [records, setRecords] = useState<KnowledgeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/knowledge');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecords(data);
      setError('');
    } catch (err) {
      setError(`Erro ao carregar registros: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkBackend = async () => {
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      alert('Erro ao conectar com o backend!');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#2c5f2d', marginBottom: '1rem' }}>
          🌱 TKB - Traditional Knowledge Blockchain
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Plataforma para registro e proteção do conhecimento tradicional associado à biodiversidade
        </p>
      </header>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button 
          onClick={checkBackend}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Testar Backend
        </button>
        <button 
          onClick={fetchRecords}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Recarregar Registros
        </button>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
        <h2 style={{ color: '#2c5f2d', marginBottom: '1rem' }}>
          📋 Registros de Conhecimento Tradicional
        </h2>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>🔄 Carregando registros...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>📭 Nenhum registro encontrado</p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Total de registros: <strong>{records.length}</strong>
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {records.map((record) => (
                <div 
                  key={record.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>🏷️ ID:</strong> {record.id}
                    </div>
                    <div>
                      <strong>🌍 Comunidade:</strong> {record.communityId}
                    </div>
                    <div>
                      <strong>👤 Responsável:</strong> 
                      <code style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', padding: '2px 4px', marginLeft: '4px' }}>
                        {record.communityLead.slice(0, 10)}...
                      </code>
                    </div>
                    <div>
                      <strong>📅 Registrado em:</strong> {new Date(record.timestamp).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>🔗 IPFS Hash:</strong> 
                    <code style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', padding: '2px 4px', marginLeft: '4px' }}>
                      {record.ipfsHash}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
