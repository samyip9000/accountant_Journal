/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("journal_list", (table) => {
    //Sam: Note for below name, always use lower case because some database do not support upper cases.
    table.increments();
    table.integer("user_id");
    table.foreign("user_id").references("users.id");    //Sam: This line caused error, need to get back to it later on.
    table.integer("journal_id");
    table.string("type").notNullable();
    table.date("date").notNullable(); // Sam: Should be above the type if time allows to make the swap.
    table.string("account").notNullable();
    table.integer("amount").notNullable();
    table.string("document");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("journal_list");
};
