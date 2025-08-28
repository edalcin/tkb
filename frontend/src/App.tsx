import React, { useState, useEffect } from 'react';

interface TraditionalKnowledgeRecord {
  id: string;
  scientificName: string;
  commonName: string;
  speciesType: string;
  habitat: string;
  useTo: string;
  partsUsed: string;
  preparationMethods: string;
  useToRemarks: string;
  traditionalRecipeHash: string;
  culturalSignificanceHash: string;
  communityId: string;
  communityName: string;
  communityLocationHash: string;
  communityContactAddress: string;
  contributorAddress: string;
  dateRecorded: string;
  lastUpdated: string;
  verificationStatus: number;
  accessPermissions: number;
  licensingInformationHash: string;
  validatorId: string;
}

function App() {
  const [records, setRecords] = useState<TraditionalKnowledgeRecord[]>([]);
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
                  <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c5f2d' }}>
                      🌿 {record.scientificName} ({record.commonName})
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <span style={{ backgroundColor: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '3px', marginRight: '0.5rem' }}>
                        {record.speciesType}
                      </span>
                      <span style={{ backgroundColor: '#007bff', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>
                        {record.useTo}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <strong>🏷️ ID:</strong> {record.id}
                    </div>
                    <div>
                      <strong>🌍 Habitat:</strong> {record.habitat}
                    </div>
                    <div>
                      <strong>🌱 Partes Usadas:</strong> {record.partsUsed}
                    </div>
                    <div>
                      <strong>⚗️ Preparo:</strong> {record.preparationMethods}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong>📝 Uso:</strong> {record.useToRemarks}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                    <div>
                      <strong>🏘️ Comunidade:</strong> {record.communityName} ({record.communityId})
                    </div>
                    <div>
                      <strong>📅 Registrado:</strong> {new Date(record.dateRecorded).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <strong>🔄 Atualizado:</strong> {new Date(record.lastUpdated).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <strong>✅ Status:</strong> {record.verificationStatus === 0 ? 'Pendente' : record.verificationStatus === 1 ? 'Verificado' : 'Validado'}
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.8rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>👤 Contribuidor:</strong> 
                      <code style={{ marginLeft: '4px' }}>{record.contributorAddress.slice(0, 10)}...{record.contributorAddress.slice(-8)}</code>
                    </div>
                    <div>
                      <strong>📞 Contato Comunidade:</strong> 
                      <code style={{ marginLeft: '4px' }}>{record.communityContactAddress.slice(0, 10)}...{record.communityContactAddress.slice(-8)}</code>
                    </div>
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
