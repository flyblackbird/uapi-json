export default (string) => {
  if (Object.prototype.toString.apply(string) !== '[object String]') {
    return null;
  }
  return string.split(' ').map(name => (
    name.length ? name[0].toUpperCase() + name.slice(1).toLowerCase() : ''
  )).join(' ');
};
