import { parseRemoteUrl } from "../git.js";

describe("parseRemoteUrl", () => {
  it("should return correctly (HTTPS)", () => {
    const url = "https://github.com/USERNAME/REPOSITORY.git";
    const expected = {
      serverUrl: "https://github.com",
      repository: "USERNAME/REPOSITORY",
    };
    const actual = parseRemoteUrl(url);
    expect(actual).toStrictEqual(expected);
  });

  it("should return correctly (HTTP)", () => {
    const url = "http://github.example.com/USERNAME/REPOSITORY.git";
    const expected = {
      serverUrl: "http://github.example.com",
      repository: "USERNAME/REPOSITORY",
    };
    const actual = parseRemoteUrl(url);
    expect(actual).toStrictEqual(expected);
  });

  it("should return correctly (SSH)", () => {
    const url = "git@github.com:USERNAME/REPOSITORY.git";
    const expected = {
      serverUrl: "https://github.com",
      repository: "USERNAME/REPOSITORY",
    };
    const actual = parseRemoteUrl(url);
    expect(actual).toStrictEqual(expected);
  });
});
