import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TouchControls } from './TouchControls';

describe('TouchControls', () => {
  it('reports d-pad direction and fire to onInput', async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<TouchControls onInput={onInput} />);

    expect(screen.getByRole('group', { name: /d-pad/i })).toBeInTheDocument();

    await user.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('button', { name: /move up/i }) });
    expect(onInput).toHaveBeenCalledWith('up', false);

    await user.pointer({ keys: '[/MouseLeft]', target: screen.getByRole('button', { name: /move up/i }) });
    expect(onInput).toHaveBeenCalledWith(null, false);

    await user.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('button', { name: /fire/i }) });
    expect(onInput).toHaveBeenCalledWith(null, true);
  });
});
