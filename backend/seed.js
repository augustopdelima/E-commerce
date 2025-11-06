const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database.sqlite");


async function initDataUser() {
  const passHash = await bcrypt.hash("123456", 10);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          type TEXT CHECK(type IN ('admin', 'client')) NOT NULL
        )
      `);

      const stmt = db.prepare(
        "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)"
      );

      stmt.run("João da Silva", "joao2@example.com", passHash, "client");
      stmt.run("Admin Master", "admin2@example.com", passHash, "admin");

      stmt.finalize((err) => {
        if (err) reject(err);
        else {
          console.log("Usuários criados com sucesso!");
          resolve();
        }
      });
    });
  });
}

function initDataSuppliers() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      
      db.run(`
        CREATE TABLE IF NOT EXISTS suppliers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          active INTEGER DEFAULT 1,
          createdAt TEXT,
          updatedAt TEXT
        )
      `, (err) => {
        if (err) return reject(err);

        const stmt = db.prepare(
          `INSERT OR IGNORE INTO suppliers 
           (name, email, phone, active, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?)`
        );

        const now = new Date().toISOString();

        const suppliers = [
          ["SportsWear LTDA", "vendas@sportswear.com", "(11) 98888-1111", 1, now, now],
          ["FitLife Distribuidora", "contato@fitlife.com", "(21) 97777-2222", 1, now, now],
          ["ActiveShop", "suporte@activeshop.com", "(31) 96666-3333", 1, now, now],
          ["ProGear", "info@progear.com", "(41) 95555-4444", 1, now, now],
          ["Energy Sports", "sales@energysports.com", "(51) 94444-5555", 1, now, now],
        ];

        // insere cada fornecedor
        for (const s of suppliers) {
          stmt.run(s, (err) => {
            if (err) console.error("Erro ao inserir supplier:", err);
          });
        }

       
        stmt.finalize((err) => {
          if (err) return reject(err);
          console.log("✅ Fornecedores criados com sucesso!");
          resolve();
        });
      });
    });
  });
}


function initDataProducts() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          stock INTEGER NOT NULL,
          imageUrl TEXT,
          supplierId INTEGER,
          active INTEGER DEFAULT 1,
          FOREIGN KEY (supplierId) REFERENCES suppliers(id)
        )
      `);

      const stmt = db.prepare(`
        INSERT INTO products (name, description, price, stock, imageUrl, supplierId, active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const products = [
        [
          "Camiseta Esportiva",
          "Camiseta 100% algodão, leve e confortável, ideal para treinos e uso casual.",
          59.9,
          20,
          "http://localhost:3000/uploads/camiseta-esportiva.png",
          1,
          1,
        ],
        [
          "Tênis Running Pro",
          "Tênis esportivo leve e com amortecimento, ideal para corridas leves e caminhadas.",
          199.9,
          15,
          "http://localhost:3000/uploads/tenis-esportivo.webp",
          2,
          1,
        ],
        [
          "Mochila Active",
          "Mochila resistente e espaçosa, perfeita para academia e uso diário.",
          129.9,
          10,
          "http://localhost:3000/uploads/mochila-esportiva.avif",
          3,
          1,
        ],
        [
          "Garrafa Térmica",
          "Garrafa térmica de aço inoxidável com isolamento a vácuo, ideal para treinos e escritório.",
          89.9,
          25,
          "http://localhost:3000/uploads/garrafa-termica-esportiva.jpg",
          4,
          1,
        ],
        [
          "Relógio Fitness",
          "Relógio inteligente com monitor de frequência cardíaca e rastreamento de sono.",
          249.9,
          8,
          "http://localhost:3000/uploads/relogio-fitness.jpg",
          5,
          1,
        ],
      ];

      products.forEach((p) => stmt.run(p));

      stmt.finalize((err) => {
        if (err) reject(err);
        else {
          console.log("Produtos criados com sucesso!");
          resolve();
        }
      });
    });
  });
}


async function seed() {
  try {
    await initDataSuppliers();
    await initDataProducts();
    await initDataUser();
  } catch (err) {
    console.error("Erro ao popular o banco:", err);
  } finally {
    db.close((err) => {
      if (err) console.error("Erro ao fechar o banco:", err.message);
      else console.log("Conexão com o banco encerrada.");
    });
  }
}

seed();
