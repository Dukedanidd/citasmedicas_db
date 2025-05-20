import { useState, useEffect } from 'react';
import styles from '@/styles/index.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('view');
  const [activeTable, setActiveTable] = useState('usuarios');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    password: '',
    role_id: 1
  });
  const [editingId, setEditingId] = useState(null);

  const tables = [
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'medicos', label: 'Médicos' },
    { id: 'pacientes', label: 'Pacientes' },
    { id: 'citas', label: 'Citas' },
    { id: 'consultorios', label: 'Consultorios' }
  ];

  // Fetch data when activeTable changes
  useEffect(() => {
    fetchData();
  }, [activeTable]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/${activeTable}`);
      if (!response.ok) throw new Error('Error fetching data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingId 
        ? `/api/${activeTable}/${editingId}`
        : `/api/${activeTable}`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error saving data');
      
      await fetchData();
      setFormData({
        primer_nombre: '',
        segundo_nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        password: '',
        role_id: 1
      });
      setEditingId(null);
      setActiveTab('view');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/${activeTable}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error deleting data');
      
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      primer_nombre: item.primer_nombre,
      segundo_nombre: item.segundo_nombre || '',
      apellido_paterno: item.apellido_paterno,
      apellido_materno: item.apellido_materno || '',
      email: item.email,
      password: '', // Don't show password
      role_id: item.role_id
    });
    setEditingId(item.user_id);
    setActiveTab('edit');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Clínica Médica</h1>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navButton} ${activeTab === 'view' ? styles.active : ''}`}
            onClick={() => setActiveTab('view')}
          >
            Ver Registros
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'add' ? styles.active : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Agregar
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'edit' ? styles.active : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            Editar
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'delete' ? styles.active : ''}`}
            onClick={() => setActiveTab('delete')}
          >
            Eliminar
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          {loading && <div className={styles.loading}>Cargando...</div>}

          {activeTab === 'view' && (
            <div className={styles.section}>
              <div className={styles.tableNav}>
                {tables.map(table => (
                  <button
                    key={table.id}
                    className={`${styles.tableNavButton} ${activeTable === table.id ? styles.active : ''}`}
                    onClick={() => setActiveTable(table.id)}
                  >
                    {table.label}
                  </button>
                ))}
              </div>
              <h2>{tables.find(t => t.id === activeTable)?.label}</h2>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {activeTable === 'usuarios' && (
                        <>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Acciones</th>
                        </>
                      )}
                      {activeTable === 'medicos' && (
                        <>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Especialidad</th>
                          <th>Consultorio</th>
                          <th>Acciones</th>
                        </>
                      )}
                      {activeTable === 'pacientes' && (
                        <>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Fecha Nacimiento</th>
                          <th>Doctor</th>
                          <th>Acciones</th>
                        </>
                      )}
                      {activeTable === 'citas' && (
                        <>
                          <th>ID</th>
                          <th>Paciente</th>
                          <th>Doctor</th>
                          <th>Fecha/Hora</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </>
                      )}
                      {activeTable === 'consultorios' && (
                        <>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Dirección</th>
                          <th>Acciones</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item.user_id}>
                        <td>{item.user_id}</td>
                        <td>{item.primer_nombre} {item.segundo_nombre}</td>
                        <td>{item.email}</td>
                        <td>{item.rol_nombre}</td>
                        <td>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleEdit(item)}
                          >
                            Editar
                          </button>
                          <button 
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDelete(item.user_id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className={styles.section}>
              <div className={styles.tableNav}>
                {tables.map(table => (
                  <button
                    key={table.id}
                    className={`${styles.tableNavButton} ${activeTable === table.id ? styles.active : ''}`}
                    onClick={() => setActiveTable(table.id)}
                  >
                    {table.label}
                  </button>
                ))}
              </div>
              <h2>Agregar {tables.find(t => t.id === activeTable)?.label}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                {activeTable === 'usuarios' && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="primer_nombre">Primer Nombre</label>
                      <input type="text" id="primer_nombre" name="primer_nombre" value={formData.primer_nombre} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="segundo_nombre">Segundo Nombre</label>
                      <input type="text" id="segundo_nombre" name="segundo_nombre" value={formData.segundo_nombre} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="apellido_paterno">Apellido Paterno</label>
                      <input type="text" id="apellido_paterno" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="apellido_materno">Apellido Materno</label>
                      <input type="text" id="apellido_materno" name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="password">Contraseña</label>
                      <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="role_id">Rol</label>
                      <select id="role_id" name="role_id" value={formData.role_id} onChange={handleInputChange} required>
                        <option value="1">Doctor</option>
                        <option value="2">Paciente</option>
                      </select>
                    </div>
                  </>
                )}
                {activeTable === 'medicos' && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="especialidad">Especialidad</label>
                      <input type="text" id="especialidad" name="especialidad" value={formData.especialidad} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="consultorio_id">Consultorio</label>
                      <select id="consultorio_id" name="consultorio_id" value={formData.consultorio_id} onChange={handleInputChange}>
                        <option value="1">Consultorio 1</option>
                        <option value="2">Consultorio 2</option>
                      </select>
                    </div>
                  </>
                )}
                {activeTable === 'pacientes' && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                      <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="sexo">Sexo</label>
                      <select id="sexo" name="sexo" value={formData.sexo} onChange={handleInputChange}>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="doctor_id">Doctor</label>
                      <select id="doctor_id" name="doctor_id" value={formData.doctor_id} onChange={handleInputChange}>
                        <option value="1">Dr. Juan Pérez</option>
                        <option value="2">Dra. María García</option>
                      </select>
                    </div>
                  </>
                )}
                {activeTable === 'citas' && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="paciente_id">Paciente</label>
                      <select id="paciente_id" name="paciente_id" value={formData.paciente_id} onChange={handleInputChange}>
                        <option value="1">Juan Pérez</option>
                        <option value="2">María García</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="doctor_id">Doctor</label>
                      <select id="doctor_id" name="doctor_id" value={formData.doctor_id} onChange={handleInputChange}>
                        <option value="1">Dr. Juan Pérez</option>
                        <option value="2">Dra. María García</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="fecha_hora">Fecha y Hora</label>
                      <input type="datetime-local" id="fecha_hora" name="fecha_hora" value={formData.fecha_hora} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="estado_id">Estado</label>
                      <select id="estado_id" name="estado_id" value={formData.estado_id} onChange={handleInputChange}>
                        <option value="1">Programada</option>
                        <option value="2">Confirmada</option>
                        <option value="3">Cancelada</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="notas">Notas</label>
                      <textarea id="notas" name="notas" value={formData.notas} onChange={handleInputChange} />
                    </div>
                  </>
                )}
                {activeTable === 'consultorios' && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="nombre">Nombre</label>
                      <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="calle">Calle</label>
                      <input type="text" id="calle" name="calle" value={formData.calle} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="numero_ext">Número Exterior</label>
                      <input type="text" id="numero_ext" name="numero_ext" value={formData.numero_ext} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="colonia">Colonia</label>
                      <input type="text" id="colonia" name="colonia" value={formData.colonia} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="ciudad">Ciudad</label>
                      <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="estado">Estado</label>
                      <input type="text" id="estado" name="estado" value={formData.estado} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="codigo_postal">Código Postal</label>
                      <input type="text" id="codigo_postal" name="codigo_postal" value={formData.codigo_postal} onChange={handleInputChange} />
                    </div>
                  </>
                )}
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    Guardar
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => {
                      setActiveTab('view');
                      setEditingId(null);
                      setFormData({
                        primer_nombre: '',
                        segundo_nombre: '',
                        apellido_paterno: '',
                        apellido_materno: '',
                        email: '',
                        password: '',
                        role_id: 1
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className={styles.section}>
              <div className={styles.tableNav}>
                {tables.map(table => (
                  <button
                    key={table.id}
                    className={`${styles.tableNavButton} ${activeTable === table.id ? styles.active : ''}`}
                    onClick={() => setActiveTable(table.id)}
                  >
                    {table.label}
                  </button>
                ))}
              </div>
              <h2>Editar {tables.find(t => t.id === activeTable)?.label}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Similar form fields as in 'add' but with pre-filled values */}
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    Actualizar
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => {
                      setActiveTab('view');
                      setEditingId(null);
                      setFormData({
                        primer_nombre: '',
                        segundo_nombre: '',
                        apellido_paterno: '',
                        apellido_materno: '',
                        email: '',
                        password: '',
                        role_id: 1
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className={styles.section}>
              <div className={styles.tableNav}>
                {tables.map(table => (
                  <button
                    key={table.id}
                    className={`${styles.tableNavButton} ${activeTable === table.id ? styles.active : ''}`}
                    onClick={() => setActiveTable(table.id)}
                  >
                    {table.label}
                  </button>
                ))}
              </div>
              <h2>Eliminar {tables.find(t => t.id === activeTable)?.label}</h2>
              <div className={styles.deleteContainer}>
                <p>¿Está seguro que desea eliminar este registro?</p>
                <div className={styles.deleteActions}>
                  <button className={`${styles.deleteButton} ${styles.confirm}`} onClick={() => handleDelete(editingId)}>
                    Confirmar
                  </button>
                  <button className={`${styles.deleteButton} ${styles.cancel}`} onClick={() => setActiveTab('view')}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
