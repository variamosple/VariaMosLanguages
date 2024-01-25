import { joinPath } from "./PathUtils";

test("the joinPath method should return a clean url path if a url with a / is passed through", () => {
  expect(joinPath("https://www.variamos.com/", "/user")).toBe(
    "https://www.variamos.com/user"
  );
});

test("the joinPath method should return a clean url path if one of the parameters does not have a /", () => {
  expect(joinPath("https://www.variamos.com/", "user")).toBe(
    "https://www.variamos.com/user"
  );
});

test("the joinPath method should return a clean url path if one of the parameters / in the middle", () => {
  expect(joinPath("https://www.variamos.com/", "user/test")).toBe(
    "https://www.variamos.com/user/test"
  );
});

test("the joinPath method should return a clean url path if there are several parameters", () => {
  expect(joinPath("https://www.variamos.com/", "user/test", "test2")).toBe(
    "https://www.variamos.com/user/test/test2"
  );
});


test("the joinPath method should return a clean url path without https/http if none of the parameters have them", () => {
  expect(joinPath("test1", "user/test", "test2")).toBe(
    "test1/user/test/test2"
  );
});
