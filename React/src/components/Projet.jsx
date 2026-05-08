import React from 'react';

const Projet = ({ projet, onSupprimer, onDetail }) => {
  return (
    <div className="projet-card">
      <div className="projet-image-wrapper">
        {projet.image ? (
          <img
            src={projet.image}
            alt={projet.nom}
            className="projet-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x300?text=Image+non+disponible';
            }}
          />
        ) : (
          <div className="projet-image-placeholder"><span>🖼️</span></div>
        )}
        <div className="projet-image-overlay" />
      </div>

      <div className="projet-body">
        <div className="projet-techs">
          {projet.technologies?.map((tech, i) => (
            <span key={i} className="tech-badge">{tech}</span>
          ))}
        </div>

        {/* Libellé = ancre cliquable → détail */}
        <h3 className="projet-nom">
          <button className="projet-lien-titre" onClick={() => onDetail(projet)}>
            {projet.nom}
          </button>
        </h3>

        <p className="projet-desc">{projet.description?.substring(0, 90)}…</p>

        <div className="projet-footer">
          <span className="projet-date">
            {projet.date
              ? new Date(projet.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })
              : ''}
          </span>
          <button className="btn-supprimer" onClick={() => onSupprimer(projet.id)}>
            🗑 Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projet;