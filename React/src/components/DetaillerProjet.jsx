import React, { useState } from 'react';

const DetaillerProjet = ({ projet, onAnnuler, onEditer }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...projet, technologies: projet.technologies?.join(', ') || '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    const updated = {
      ...form,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
    };
    await onEditer(updated);
    setLoading(false);
    setEditMode(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onAnnuler()}>
      <div className="modal-box">

        {/* Header */}
        <div className="modal-header">
          <span className="modal-header-title">{editMode ? '✏️ Édition' : '📁 Détail du projet'}</span>
          <button className="modal-close" onClick={onAnnuler}>&times;</button>
        </div>

        {/* Image (mode lecture seulement) */}
        {!editMode && projet.image && (
          <div className="modal-img-wrapper">
            <img src={projet.image} alt={projet.nom} className="modal-img"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x300?text=Image+non+disponible'; }} />
          </div>
        )}

        {/* Contenu */}
        <div className="modal-body">
          {editMode ? (
            <>
              <div className="field-group">
                <label className="field-label">Nom</label>
                <input name="nom" className="field-input" value={form.nom} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label className="field-label">Description</label>
                <textarea name="description" className="field-input field-textarea" rows={4} value={form.description} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label className="field-label">Technologies (séparées par virgule)</label>
                <input name="technologies" className="field-input" value={form.technologies} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label className="field-label">Lien</label>
                <input name="lien" className="field-input" value={form.lien || ''} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label className="field-label">Date</label>
                <input name="date" type="date" className="field-input" value={form.date || ''} onChange={handleChange} />
              </div>
            </>
          ) : (
            <>
              <h2 className="modal-projet-nom">{projet.nom}</h2>
              {projet.date && (
                <p className="modal-meta">
                  📅 {new Date(projet.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
              <div className="modal-section">
                <h4 className="modal-section-title">Description</h4>
                <p className="modal-desc">{projet.description}</p>
              </div>
              {projet.technologies?.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Technologies</h4>
                  <div className="modal-techs">
                    {projet.technologies.map((tech, i) => (
                      <span key={i} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
              {projet.lien && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Lien</h4>
                  <a href={projet.lien} target="_blank" rel="noreferrer" className="modal-link">🔗 {projet.lien}</a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="modal-footer">
          {editMode ? (
            <>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Enregistrement…' : '💾 Enregistrer'}
              </button>
              <button className="btn-ghost" onClick={() => setEditMode(false)}>Annuler l'édition</button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={() => setEditMode(true)}>✏️ Éditer</button>
              <button className="btn-ghost" onClick={onAnnuler}>✖ Annuler</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetaillerProjet;