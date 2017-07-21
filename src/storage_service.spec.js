// @flow
import * as StorageService from "./storage_service";

describe("storageService", () => {
  describe("loadFromLocalStorage", () => {
    it("works", () => {
      const storageService = StorageService.make({});
      const mockData = { foo: "hello" };
      global.localStorage = {
        getItem: jest.fn(() => JSON.stringify(mockData))
      };
      const result = storageService.loadFromLocalStorage();
      expect(global.localStorage.getItem).toHaveBeenCalledWith("App");
      expect(result).toEqual(mockData);
    });
  });

  describe("saveToLocalStorage", () => {
    it("works", () => {
      const storageService = StorageService.make({});
      let result;
      global.localStorage = {
        setItem: jest.fn((key, value) => {
          result = value;
        })
      };
      const mockData = { foo: "hello" };
      storageService.saveToLocalStorage((mockData: any));
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        "App",
        JSON.stringify(mockData)
      );
      expect(result).toEqual(JSON.stringify(mockData));
    });
  });
});
