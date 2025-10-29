import React from 'react';

const InfoRow = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{value}</dd>
  </div>
);

const UserInfo = ({ userData }) => {
  return (
    <div className="glass-card rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Información Personal</h2>
      <dl className="divide-y divide-gray-700">
        <InfoRow label="Nombre" value={userData.nombre} />
        <InfoRow label="Email" value={userData.email} />
        <InfoRow label="País" value={userData.pais} />
        <InfoRow label="Moneda Preferida" value={userData.moneda_preferida} />
        <InfoRow label="Rol" value={userData.rol} />
        <InfoRow label="Fecha de Registro" value={new Date(userData.fecha_registro).toLocaleDateString()} />
      </dl>
    </div>
  );
};

export default UserInfo;
