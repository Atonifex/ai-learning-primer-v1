import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const folder = resolve(process.cwd(), 'public/cinematics/prologue-v1');
const json = (name: string) => JSON.parse(readFileSync(resolve(folder, name), 'utf8'));
const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const seconds = (stamp: string) => stamp.split(':').reduce((sum, part) => sum * 60 + Number(part), 0);

describe('Prologue production caption coverage', () => {
  it('covers every generated spoken line in its shot without overlapping or unreadable captions', () => {
    const shots = json('shots.json').scenes;
    const speech = json('speech-validation.json');
    const captions = readFileSync(resolve(folder, 'prologue.en.vtt'), 'utf8')
      .replace(/\r/g, '').split(/\n\n+/).filter(block => /^p\d+\n/.test(block));
    expect(captions).toHaveLength(shots.length);
    let previousEnd = 0;
    captions.forEach((block, index) => {
      const [id, timing, ...lines] = block.trim().split('\n');
      const [start, end] = timing.split(' --> ').map(seconds);
      const shot = shots[index];
      const verification = speech.find((entry: { id: string }) => entry.id === id);
      expect(id).toBe(shot.id);
      expect(start).toBeGreaterThanOrEqual(previousEnd);
      expect(start).toBeGreaterThanOrEqual(index * 5);
      expect(end).toBeLessThanOrEqual((index + 1) * 5);
      expect(end).toBeGreaterThan(start);
      expect(lines.length).toBeLessThanOrEqual(2);
      lines.forEach(line => expect(line.length).toBeLessThanOrEqual(48));
      expect(normalized(lines.join(' ').replace(/^[A-Z]+:\s*/, ''))).toBe(normalized(verification.heard));
      previousEnd = end;
    });
  });
});
