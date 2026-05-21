import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from './Breadcrumb';

import { render, screen } from '@testing-library/react';

function renderAt(segments: string[]) {
  return render(
    <MemoryRouter>
      <Breadcrumb segments={segments} />
    </MemoryRouter>,
  );
}

describe('Breadcrumb', () => {
  it('renders only the Home icon for the root', () => {
    renderAt([]);
    expect(screen.getByTitle('Home')).toBeInTheDocument();
  });

  it('renders each segment with the correct cumulative href', () => {
    renderAt(['a', 'b', 'c']);
    expect(screen.getByRole('link', { name: 'a' })).toHaveAttribute(
      'href',
      '/a',
    );
    expect(screen.getByRole('link', { name: 'b' })).toHaveAttribute(
      'href',
      '/a/b',
    );
    // Last segment is rendered as text, not a link.
    expect(screen.queryByRole('link', { name: 'c' })).toBeNull();
    expect(screen.getByText('c')).toBeInTheDocument();
  });
});
