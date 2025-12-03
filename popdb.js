const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "productsdb",
  port: 5432,
});

async function init() {
  try {
    console.log("Creating table products...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price NUMERIC
      );
    `);

    console.log("Inserting initial data...");

    await pool.query(`
      INSERT INTO products (name, price) VALUES
      ('Laptop', 1200),
      ('Keyboard', 100),
      ('Mouse', 60)
      ON CONFLICT DO NOTHING;
    `);

    console.log("Database initialized!");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    pool.end();
  }
}

init();