import { FileText, Plus, Search, CheckCircle, Clock, XCircle, Edit2, X, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contracts, setContracts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    artistName: '',
    contractType: 'Distribución',
    royaltyPercentage: 50,
    workBilling: 0,
    startDate: '',
    endDate: '',
    status: 'active'
  });
  const [contractPDF, setContractPDF] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');

  useEffect(() => {
    const demoContracts = [
      {
        id: 1,
        artistName: 'ROSALÍA',
        contractType: 'Distribución + Edición',
        royaltyPercentage: 60,
        workBilling: 15000,
        startDate: '2024-01-15',
        endDate: '2027-01-15',
        status: 'active'
      },
      {
        id: 2,
        artistName: 'Bad Bunny',
        contractType: 'Distribución',
        royaltyPercentage: 55,
        workBilling: 12000,
        startDate: '2024-03-20',
        endDate: '2026-03-20',
        status: 'active'
      },
      {
        id: 3,
        artistName: 'C. Tangana',
        contractType: 'Distribución + Edición',
        royaltyPercentage: 50,
        workBilling: 8000,
        startDate: '2023-11-10',
        endDate: '2026-11-10',
        status: 'active'
      },
      {
        id: 4,
        artistName: 'Aitana',
        contractType: 'Edición Musical',
        royaltyPercentage: 45,
        workBilling: 6500,
        startDate: '2024-05-01',
        endDate: '2027-05-01',
        status: 'active'
      },
      {
        id: 5,
        artistName: 'Rauw Alejandro',
        contractType: 'Distribución',
        royaltyPercentage: 50,
        workBilling: 9000,
        startDate: '2024-02-14',
        endDate: '2026-02-14',
        status: 'active'
      },
      {
        id: 6,
        artistName: 'Nathy Peluso',
        contractType: 'Distribución + Edición',
        royaltyPercentage: 55,
        workBilling: 7000,
        startDate: '2023-09-20',
        endDate: '2026-09-20',
        status: 'active'
      },
      {
        id: 7,
        artistName: 'Becky G',
        contractType: 'Distribución',
        royaltyPercentage: 48,
        workBilling: 5500,
        startDate: '2024-06-15',
        endDate: '2026-06-15',
        status: 'pending'
      },
      {
        id: 8,
        artistName: 'Mora',
        contractType: 'Edición Musical',
        royaltyPercentage: 45,
        workBilling: 4000,
        startDate: '2024-08-01',
        endDate: '2027-08-01',
        status: 'active'
      }
    ];

    const localContracts = JSON.parse(localStorage.getItem('contracts') || '[]');
    setContracts(localContracts.length > 0 ? localContracts : demoContracts);
  }, []);

  const filteredContracts = contracts.filter((contract: any) =>
    contract.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={20} color="#22c55e" />;
      case 'pending':
        return <Clock size={20} color="#fb923c" />;
      case 'expiring':
        return <Clock size={20} color="#ef4444" />;
      default:
        return <XCircle size={20} color="#6b7280" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'pending':
        return 'Pendiente';
      case 'expiring':
        return 'Por expirar';
      default:
        return 'Inactivo';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'pending':
        return '#fb923c';
      case 'expiring':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      artistName: '',
      contractType: 'Distribución',
      royaltyPercentage: 50,
      workBilling: 0,
      startDate: '',
      endDate: '',
      status: 'active'
    });
    setContractPDF(null);
    setPdfFileName('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleAddContract = () => {
    const newContract = {
      id: Date.now(),
      artistName: formData.artistName,
      contractType: formData.contractType,
      royaltyPercentage: parseInt(formData.royaltyPercentage.toString(), 10),
      workBilling: parseInt(formData.workBilling.toString(), 10),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status
    };
    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    setShowModal(false);
    resetForm();
  };

  const handleEditContract = () => {
    if (editingId !== null) {
      const updatedContracts = contracts.map((contract: any) =>
        contract.id === editingId ? {
          ...contract,
          artistName: formData.artistName,
          contractType: formData.contractType,
          royaltyPercentage: parseInt(formData.royaltyPercentage.toString(), 10),
          workBilling: parseInt(formData.workBilling.toString(), 10),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status
        } : contract
      );
      setContracts(updatedContracts);
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));
      setShowModal(false);
      resetForm();
    }
  };

  const openEditModal = (contract: any) => {
    setEditingId(contract.id);
    setFormData({
      artistName: contract.artistName,
      contractType: contract.contractType,
      royaltyPercentage: contract.royaltyPercentage,
      workBilling: contract.workBilling,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status
    });
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#ffffff',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FileText size={32} color="#c9a574" />
          Gestión de Contratos
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Contratos guardados en MySQL
        </p>
      </div>

      {/* Barra de acciones */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(42, 63, 63, 0.4)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '12px',
          }}>
            <Search size={20} color="#c9a574" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por artista o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
          }}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          Nuevo Contrato
        </button>
      </div>

      {/* Grid de contratos */}
      {filteredContracts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredContracts.map((contract: any) => (
            <div
              key={contract.id}
              style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
              }}
            >
              {/* Header con artista y estado */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#ffffff',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {contract.artistName}
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#AFB3B7',
                    margin: 0
                  }}>
                    {contract.contractType}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: `${getStatusColor(contract.status)}15`,
                  borderRadius: '8px',
                  flexShrink: 0,
                  marginLeft: '12px'
                }}>
                  {getStatusIcon(contract.status)}
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: getStatusColor(contract.status)
                  }}>
                    {getStatusText(contract.status)}
                  </span>
                </div>
              </div>

              {/* Royalties y Facturación */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '16px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                  <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '8px' }}>
                    Split de Royalties
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#ffffff' }}>Artista</span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#c9a574' }}>
                        {contract.royaltyPercentage}%
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '12px', color: '#AFB3B7' }}>BAM</span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#8b9299' }}>
                        {100 - contract.royaltyPercentage}%
                      </span>
                    </div>
                  </div>
                  {/* Barra visual del split */}
                  <div style={{
                    height: '6px',
                    background: 'rgba(139, 146, 153, 0.3)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${contract.royaltyPercentage}%`,
                      background: 'linear-gradient(90deg, #c9a574 0%, #d4b892 100%)',
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>
                <div style={{
                  padding: '12px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px' }}>
                    Facturación
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>
                    €{contract.workBilling.toLocaleString('es-ES')}
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div style={{
                padding: '12px',
                background: 'rgba(42, 63, 63, 0.5)',
                borderRadius: '10px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px' }}>
                      Inicio
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                      {new Date(contract.startDate).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div style={{ 
                    width: '1px', 
                    height: '30px', 
                    background: 'rgba(201, 165, 116, 0.2)' 
                  }}></div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px' }}>
                      Vencimiento
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                      {new Date(contract.endDate).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Editar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(contract);
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(201, 165, 116, 0.25)',
                  borderRadius: '8px',
                  color: '#c9a574',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Edit2 size={14} />
                Editar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <FileText size={48} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            No se encontraron contratos
          </h3>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
            {contracts.length === 0 
              ? 'Crea tu primer contrato con el botón "Nuevo Contrato"'
              : 'Intenta con otros términos de búsqueda'}
          </p>
        </div>
      )}

      {/* Modal para agregar/editar contrato */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={() => setShowModal(false)}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.95) 0%, rgba(30, 47, 47, 0.98) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '20px',
            padding: '48px',
            width: '100%',
            maxWidth: '900px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '40px',
              paddingBottom: '24px',
              borderBottom: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#ffffff',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <FileText size={32} color="#c9a574" />
                  {isEditing ? 'Editar Contrato' : 'Nuevo Contrato'}
                </h2>
                <p style={{ fontSize: '14px', color: '#AFB3B7', margin: 0 }}>
                  Complete los datos del contrato del artista
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(201, 165, 116, 0.1)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#c9a574',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Columna Izquierda */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Nombre del Artista *
                  </label>
                  <input
                    type="text"
                    name="artistName"
                    value={formData.artistName}
                    onChange={handleInputChange}
                    placeholder="Ej: ROSALÍA"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(201, 165, 116, 0.08)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Tipo de Contrato *
                  </label>
                  <select
                    name="contractType"
                    value={formData.contractType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(201, 165, 116, 0.08)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Distribución">Distribución</option>
                    <option value="Distribución + Edición">Distribución + Edición</option>
                    <option value="Distribución Física">Distribución Física</option>
                    <option value="Edición Musical">Edición Musical</option>
                    <option value="Management">Management</option>
                    <option value="Otros Servicios">Otros Servicios</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Porcentaje de Royalties (Artista) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      name="royaltyPercentage"
                      value={formData.royaltyPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(201, 165, 116, 0.08)',
                        border: '1px solid rgba(201, 165, 116, 0.2)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#AFB3B7',
                      fontSize: '14px'
                    }}>
                      %
                    </span>
                  </div>
                  <div style={{ 
                    marginTop: '12px',
                    padding: '12px',
                    background: 'rgba(42, 63, 63, 0.5)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '12px', color: '#c9a574' }}>
                      Artista: {formData.royaltyPercentage}%
                    </span>
                    <span style={{ fontSize: '12px', color: '#8b9299' }}>
                      BAM: {100 - Number(formData.royaltyPercentage)}%
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Facturación Total *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#22c55e',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      €
                    </span>
                    <input
                      type="number"
                      name="workBilling"
                      value={formData.workBilling}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 36px',
                        background: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Subir Contrato PDF (Opcional)
                  </label>
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      id="pdfUpload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setContractPDF(file);
                          setPdfFileName(file.name);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="pdfUpload"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(201, 165, 116, 0.08)',
                        border: '1px dashed rgba(201, 165, 116, 0.3)',
                        borderRadius: '10px',
                        color: pdfFileName ? '#22c55e' : '#c9a574',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                      }}
                    >
                      <Upload size={18} />
                      {pdfFileName || 'Seleccionar archivo PDF'}
                    </label>
                    {pdfFileName && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>✓ {pdfFileName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setContractPDF(null);
                            setPdfFileName('');
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Columna Derecha */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(201, 165, 116, 0.08)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      colorScheme: 'dark'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(201, 165, 116, 0.08)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      colorScheme: 'dark'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px' 
                  }}>
                    Estado del Contrato *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(201, 165, 116, 0.08)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="active">Activo</option>
                    <option value="pending">Pendiente</option>
                    <option value="expiring">Por expirar</option>
                  </select>
                </div>

                {/* Vista previa del estado */}
                <div style={{
                  padding: '24px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                  <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '12px' }}>
                    Vista Previa del Estado
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: `${getStatusColor(formData.status)}15`,
                    borderRadius: '8px'
                  }}>
                    {getStatusIcon(formData.status)}
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: getStatusColor(formData.status)
                    }}>
                      {getStatusText(formData.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{ 
                gridColumn: '1 / -1',
                display: 'flex',
                gap: '16px',
                marginTop: '16px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(201, 165, 116, 0.2)'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: '1',
                    padding: '14px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '10px',
                    color: '#c9a574',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={isEditing ? handleEditContract : handleAddContract}
                  style={{
                    flex: '2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(201, 165, 116, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
                  }}
                >
                  <Plus size={20} />
                  {isEditing ? 'Guardar Cambios' : 'Guardar Contrato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
