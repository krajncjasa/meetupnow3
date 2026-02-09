import React from 'react';

export type Dogodek = {
  id: number;
  naslov: string;
  kraj: string;
  cas_dogodka: string;
  slika?: string | null;
  slikaUrl?: string | null;
  vrsta: string;
};

type Props = {
  dogodki: Dogodek[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

// 🔹 Default export
export default function SpreminjanjeDogodkovView({
  dogodki,
  loading,
  onDelete,
  onEdit,
}: Props) {
  if (loading) return <p>Nalaganje dogodkov ...</p>;
  if (dogodki.length === 0) return <p>Nimaš še nobenega dogodka.</p>;

  return (
    <div>
      {dogodki.map((dogodek) => (
        <div key={dogodek.id} data-testid="dogodek-item">
          <h3>{dogodek.naslov}</h3>
          <button onClick={() => onEdit(dogodek.id)}>Uredi</button>
          <button onClick={() => onDelete(dogodek.id)}>Izbriši</button>
        </div>
      ))}
    </div>
  );
}
