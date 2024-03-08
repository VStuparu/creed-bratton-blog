const bcrypt = require("bcrypt");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(email, password, fullname) {
    this.email = email;
    this.password = password;
    this.name = fullname;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
    });
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser !== null) {
      return true;
    }
    return false;
  }
}

module.exports = User;
