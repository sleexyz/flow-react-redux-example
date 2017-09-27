// @flow
import * as Storage from "./storage";

// TODO: refactor tests

describe("Storage", () => {
  describe("loadFromLocalStorage", () => {
    it("can retrieve stored data", () => {
      const mockData = { foo: "hello" };
      window.localStorage = {
        getItem: jest.fn(() => JSON.stringify(mockData))
      };
      const result = Storage.loadFromLocalStorage();
      expect(window.localStorage.getItem).toHaveBeenCalledWith("App");
      expect(result).toEqual(mockData);
    });
  });

  describe("saveToLocalStorage", () => {
    it("can store data and retrieve it", () => {
      let result;
      window.localStorage = {
        setItem: jest.fn((key, value) => {
          result = value;
        })
      };
      const mockData = { foo: "hello" };
      Storage.saveToLocalStorage((mockData: any));
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "App",
        JSON.stringify(mockData)
      );
      expect(result).toEqual(JSON.stringify(mockData));
    });
  });
});
