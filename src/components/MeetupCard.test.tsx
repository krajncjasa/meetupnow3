import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MeetupCard from './MeetupCard';

describe('MeetupCard komponenta', () => {
  it('prikaže naslov meetupa', () => {
    render(<MeetupCard title="React Meetup" />);

    expect(
      screen.getByText('React Meetup')
    ).toBeInTheDocument();
  });
});
