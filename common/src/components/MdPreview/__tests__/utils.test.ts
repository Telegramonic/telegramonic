import { fetchMdContent, getMdFileDataInString } from '../utils';

describe('MdPreview utils', () => {
  const responseHandler = jest.fn();
  const mockUrl = 'test-url';
  const mockContent = '# Test Content';

  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    global.fetch = jest.fn();
    // eslint-disable-next-line no-console
    console.log = jest.fn();
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  describe('fetchMdContent', () => {
    it('should fetch content and call responseHandler', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockContent),
      });

      fetchMdContent(mockUrl, responseHandler);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(mockUrl);
      expect(responseHandler).toHaveBeenCalledWith(mockContent);
    });

    it('should log error if fetch fails', async () => {
      const error = new Error('Fetch failed');
      (global.fetch as jest.Mock).mockRejectedValue(error);

      fetchMdContent(mockUrl, responseHandler);

      await new Promise((resolve) => setTimeout(resolve, 0));

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('getMdFileDataInString', () => {
    it('should not call responseHandler if path is empty', () => {
      getMdFileDataInString('', responseHandler);
      expect(responseHandler).not.toHaveBeenCalled();
    });
  });
});
