export default (url, sizeSuffix) => {
  const i = url.lastIndexOf('.');
  const base = url.substring(0, i);
  const ext = url.substring(i);
  return `${base}_${sizeSuffix}${ext}`;
};