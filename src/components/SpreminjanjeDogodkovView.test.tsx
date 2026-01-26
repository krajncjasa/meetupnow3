import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SpreminjanjeDogodkovView, { Dogodek } from './SpreminjanjeDogodkovView';

describe('SpreminjanjeDogodkovView', () => {
  it('prikaže sporočilo, ko uporabnik nima dogodkov', () => {
    render(
      <SpreminjanjeDogodkovView
        dogodki={[]}
        loading={false}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText('Nimaš še nobenega dogodka.')).toBeInTheDocument();
  });

  it('prikaže seznam dogodkov in gumbe', () => {
    const mockDogodki: Dogodek[] = [
      {
        id: 1,
        naslov: 'Test dogodek',
        kraj: 'Ljubljana',
        cas_dogodka: new Date().toISOString(),
        vrsta: 'šport',
      },
    ];

    render(
      <SpreminjanjeDogodkovView
        dogodki={mockDogodki}
        loading={false}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText('Test dogodek')).toBeInTheDocument();
    expect(screen.getByText('Uredi')).toBeInTheDocument();
    expect(screen.getByText('Izbriši')).toBeInTheDocument();
  });
});
