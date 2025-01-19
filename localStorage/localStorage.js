// another stupid singleton (there is no point)
class LocalStorage {
  constructor() {
    this.values = {};
  }
  
  /**
   * saves the current values to localStorage
   */
  save() {
    localStorage.setItem("Spentris2", JSON.stringify(this.values));
  }
  
  /**
   * loads the values from localStorage
   */
  load() {
    this.values = JSON.parse(localStorage.getItem("Spentris2"));
  }
}

export { LocalStorage };