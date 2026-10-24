import { describe, expect, it } from 'vitest';
import { toJsonScript } from './json';

describe('toJsonScript', () => {
  it('neutralizes closing script tags and HTML-sensitive characters', () => {
    const input = [{ name: '</script><script>alert("xss")</script>', developer: 'A&B' }];
    const output = toJsonScript(input);
    expect(output).not.toContain('</script>');
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('&');
    expect(JSON.parse(output)).toEqual(input);
  });

  it('escapes Unicode line separators that break inline scripts', () => {
    const input = { note: 'line\u2028break\u2029' };
    const output = toJsonScript(input);
    expect(output).not.toContain('\u2028');
    expect(output).not.toContain('\u2029');
    expect(JSON.parse(output)).toEqual(input);
  });
});
