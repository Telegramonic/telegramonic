import {
  formatSize,
  formatDate,
  getFileType,
  getFileIconType,
  getGradientForType,
  buildDashboardItemFromFile,
} from '../const';
import { IconType } from '@assets/types';

// ── formatSize ──────────────────────────────────────────────────────────────

describe('formatSize', () => {
  it('returns "0 B" for 0 bytes', () => {
    expect(formatSize(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatSize(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(formatSize(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatSize(1024 * 1024)).toBe('1 MB');
  });

  it('formats gigabytes', () => {
    expect(formatSize(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('formats decimal sizes', () => {
    expect(formatSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });
});

// ── formatDate ──────────────────────────────────────────────────────────────

describe('formatDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-10-24T12:00:00Z'));
  });
  afterEach(() => jest.useRealTimers());

  it('returns "Just now" for very recent timestamps', () => {
    expect(formatDate(new Date('2024-10-24T11:59:30Z').toISOString())).toBe(
      'Just now',
    );
  });

  it('returns minutes ago within the same hour', () => {
    expect(formatDate(new Date('2024-10-24T11:30:00Z').toISOString())).toBe(
      '30m ago',
    );
  });

  it('returns hours ago within the same day', () => {
    expect(formatDate(new Date('2024-10-24T09:00:00Z').toISOString())).toBe(
      '3h ago',
    );
  });

  it('returns a formatted date for older timestamps', () => {
    const result = formatDate(new Date('2024-10-01T12:00:00Z').toISOString());
    expect(result).toMatch(/Oct 1, 2024/);
  });

  it('returns a fallback string for a non-parseable ISO string', () => {
    // new Date('not-a-date') produces Invalid Date (NaN) — getTime() returns NaN
    // diffMins is NaN, so none of the < comparisons are truthy, falling through to toLocaleDateString
    // which may produce "Invalid Date" — we simply assert the function does not throw
    expect(() => formatDate('not-a-date')).not.toThrow();
  });
});

// ── getFileType ─────────────────────────────────────────────────────────────

describe('getFileType', () => {
  it.each([
    ['pdf', 'document'],
    ['docx', 'document'],
    ['txt', 'document'],
    ['png', 'presentation'],
    ['jpg', 'presentation'],
    ['svg', 'presentation'],
    ['mp4', 'video'],
    ['mkv', 'video'],
    ['zip', 'zip'],
    ['tar', 'zip'],
    ['ts', 'code'],
    ['tsx', 'code'],
    ['py', 'code'],
    ['csv', 'csv'],
    ['xlsx', 'csv'],
    ['mp3', 'audio'],
    ['m4a', 'audio'],
    ['exe', 'file'],
    ['', 'file'],
  ])('maps .%s → %s', (ext, expected) => {
    expect(getFileType(ext)).toBe(expected);
  });

  it('is case-insensitive', () => {
    expect(getFileType('PDF')).toBe('document');
    expect(getFileType('MP4')).toBe('video');
  });
});

// ── getFileIconType ─────────────────────────────────────────────────────────

describe('getFileIconType', () => {
  it('returns VIDEO for video type', () => {
    expect(getFileIconType('video')).toBe(IconType.VIDEO);
  });

  it('returns ZIP for zip type', () => {
    expect(getFileIconType('zip')).toBe(IconType.ZIP);
  });

  it('returns CODE for code type', () => {
    expect(getFileIconType('code')).toBe(IconType.CODE);
  });

  it('returns PRESENTATION for presentation type', () => {
    expect(getFileIconType('presentation')).toBe(IconType.PRESENTATION);
  });

  it('returns CSV for csv type', () => {
    expect(getFileIconType('csv')).toBe(IconType.CSV);
  });

  it('returns AUDIO for audio type', () => {
    expect(getFileIconType('audio')).toBe(IconType.AUDIO);
  });

  it('returns FILE for document type', () => {
    expect(getFileIconType('document')).toBe(IconType.FILE);
  });

  it('returns FILE as the default for unknown type', () => {
    expect(getFileIconType('unknown')).toBe(IconType.FILE);
  });
});

// ── getGradientForType ──────────────────────────────────────────────────────

describe('getGradientForType', () => {
  it('returns a gradient string for video', () => {
    expect(getGradientForType('video')).toContain('linear-gradient');
  });

  it('returns a gradient string for code', () => {
    expect(getGradientForType('code')).toContain('linear-gradient');
  });

  it('returns a default gradient for unknown types', () => {
    const defaultGrad = getGradientForType('unknown');
    expect(defaultGrad).toBe(
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    );
  });

  it.each(['video', 'zip', 'code', 'presentation', 'document', 'csv', 'audio'])(
    'returns a non-empty gradient for "%s"',
    (type) => {
      expect(getGradientForType(type)).toBeTruthy();
    },
  );
});

// ── buildDashboardItemFromFile ──────────────────────────────────────────────

describe('buildDashboardItemFromFile', () => {
  const file = {
    id: 42,
    name: 'report.pdf',
    size: 2 * 1024 * 1024,
    file_ext: 'pdf',
    created_at: new Date().toISOString(),
  };

  it('constructs a DashboardItem from a file', () => {
    const item = buildDashboardItemFromFile(file, 'Jane', [], []);
    expect(item.id).toBe('file-42');
    expect(item.dbId).toBe(42);
    expect(item.name).toBe('report.pdf');
    expect(item.owner).toBe('Jane');
    expect(item.type).toBe('document');
    expect(item.isFolder).toBe(false);
  });

  it('correctly marks item as starred when id is in starredIds', () => {
    const item = buildDashboardItemFromFile(file, 'Jane', ['file-42'], []);
    expect(item.starred).toBe(true);
  });

  it('correctly marks item as not starred when id is not in starredIds', () => {
    const item = buildDashboardItemFromFile(file, 'Jane', ['file-99'], []);
    expect(item.starred).toBe(false);
  });

  it('correctly marks item as inTrash when id is in trashIds', () => {
    const item = buildDashboardItemFromFile(file, 'Jane', [], ['file-42']);
    expect(item.inTrash).toBe(true);
  });

  it('formats the size correctly', () => {
    const item = buildDashboardItemFromFile(file, 'Jane', [], []);
    expect(item.size).toBe('2 MB');
    expect(item.sizeBytes).toBe(2 * 1024 * 1024);
  });
});
