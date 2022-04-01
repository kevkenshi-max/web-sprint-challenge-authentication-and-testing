const db = require("../data/dbConfig");

const find = () => {
  return db("users");
};

const findBy = (filter) => {
  return db("users").select("username", "password").where(filter);
};

const findById = async (id) => {
  return await db("users").select("username", "password").where("id", id).first();
};

const add = async (user) => {
  const [id] = await db("users").insert(user);
  return findById(id);
};

module.exports = {
  find,
  findBy,
  findById,
  add,
};
