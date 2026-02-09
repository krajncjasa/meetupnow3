import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SpreminjanjeDogodkov from './page';

// 🔧 mock next/router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// 🔧 mock SideNav (ni del testa)
vi.mock('../components/SideNav', () => ({
  default: () => <div>SideNav</div>,
}));

describe('SpreminjanjeDogodkov komponenta', () => {
  it('prikaže sporočilo, ko uporabnik nima dogodkov', async () => {
    // mock fetch → vrne prazen seznam dogodkov
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    );

    // mock localStorage (user_id obstaja)
    Storage.prototype.getItem = vi.fn(() => 'test-user-id');

    render(<SpreminjanjeDogodkov />);

    // počakamo, da loading izgine in se pokaže sporočilo
    expect(
      await screen.findByText('Nimaš še nobenega dogodka.')
    ).toBeInTheDocument();
  });
});
