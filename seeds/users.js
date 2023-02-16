/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex("users").insert([
    { username: "rowValue1", password: "password" },
    { username: "rowValue2", password: "password" },
    { username: "rowValue3", password: "password" },
  ]);
};
