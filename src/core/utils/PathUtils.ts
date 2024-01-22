export function joinPath(...args: string[]) {
  return args
    .map((part: string) => {
      const firstChar = part[0];
      const lastChar = part[part.length - 1];

      if (part.includes('http') && lastChar  === "/") {
        return part.substring(0, part.length - 1);
      }
      if (firstChar === "/") {
        return part.replaceAll("/", "");
      }
      if (lastChar === "/") {
        return part.replaceAll("/", "");
      }
      return part;
    })
    .join("/");
}
