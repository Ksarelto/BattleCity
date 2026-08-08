import { describe, it, expect } from 'vitest';
import { EventBus } from '@/game/core/eventBus';

describe('EventBus', () => {
  it('subscribes and emits events', () => {
    const bus = new EventBus();
    let received = 0;
    const unsub = bus.on('test', () => { received += 1; });
    bus.emit('test');
    bus.emit('test');
    expect(received).toBe(2);
    unsub();
    bus.emit('test');
    expect(received).toBe(2);
  });

  it('passes arguments to listeners', () => {
    const bus = new EventBus();
    let value = '';
    bus.on('msg', (v) => { value = v as string; });
    bus.emit('msg', 'hello');
    expect(value).toBe('hello');
  });
});
