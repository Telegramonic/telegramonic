import { isEmpty } from 'lodash';

/**
 * Function to fetch the markdown file content and call the response handler.
 * @param url URL of the markdown file.
 * @param responseHandler Function to handle the response.
 */
export const fetchMdContent = (
  url: string,
  responseHandler: (dataString: string) => void,
) => {
  fetch(url)
    .then((res) => {
      return res.text();
    })
    .then((res: string) => {
      responseHandler(res);
    })
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
};

/**
 * Function to fetch the markdown string data from the path.
 * @param path Path of the markdown file.
 * @param responseHandler Function to handle the response.
 * @returns
 */
export const getMdFileDataInString = (
  path: string,
  responseHandler: (dataString: string) => void,
) => {
  if (isEmpty(path)) return;

  const importPromise = path.startsWith('data/')
    ? import(`@data/${path.substring(5)}.md`)
    : import(`../../${path}.md`);

  // Fetch the markdown file data.
  importPromise
    .then((res) => {
      fetchMdContent(res.default, responseHandler);
    })
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
};
