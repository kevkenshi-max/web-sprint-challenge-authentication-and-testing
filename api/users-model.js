const db = require("../data/dbConfig");

const find = () => {
  return db("users");
};

const findBy = (filter) => {
  return db("users").select("username", "password").where(filter);
};

const findById = async (id) => {
  const user = await db("users").where("id", id).first();

  const result = {
    id: user.id,
    username: user.username,
    password: user.password,
  };
  return result;
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
