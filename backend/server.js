const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/imgs', express.static(path.join(__dirname, '../public/imgs')));

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projetofinal'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Registro de usuário
app.post('/register', async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    try {
        const [existingUsers] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "Email já está cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.promise().query(
            "INSERT INTO usuarios (userName, email, password) VALUES (?, ?, ?)",
            [userName, email, hashedPassword]
        );

        if (result.affectedRows > 0) {
            res.json({ message: "Usuário registrado com sucesso!" });
        } else {
            res.status(500).json({ error: "Falha na inserção do usuário." });
        }
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const [results] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: "Email ou senha incorretos." });
        }

        const isMatch = await bcrypt.compare(password, results[0].password);

        if (isMatch) {
            res.json({ 
                message: "Login bem-sucedido!", 
                id_usuario: results[0].id, 
                userName: results[0].userName // <- adicionado aqui
            });
        } else {
            res.status(401).json({ error: "Email ou senha incorretos." });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Listar produtos
app.get('/produtos', (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.nome,
            p.quantidade AS quantidade_disponivel,
            p.url_imagem
        FROM produtos p
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ error: "Erro ao buscar produtos." });
        }
        console.log('Produtos retornados:', results); // Log para verificar os dados retornados
        res.json(results);
    });
});

// Adicionar ou atualizar produto no carrinho
app.post('/carrinho', (req, res) => {
    const { produto_id, quantidade, url_imagem, id_usuario } = req.body;

    if (!produto_id || !quantidade || !url_imagem || !id_usuario) {
        return res.status(400).json({ error: "Dados inválidos para o carrinho." });
    }

    const checkSql = "SELECT * FROM carrinho WHERE produto_id = ? AND id_usuario = ?";
    db.query(checkSql, [produto_id, id_usuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao verificar carrinho." });

        if (result.length > 0) {
            db.query("UPDATE carrinho SET quantidade = quantidade + ? WHERE produto_id = ? AND id_usuario = ?",
                [quantidade, produto_id, id_usuario], (err) => {
                    if (err) return res.status(500).json({ error: "Erro ao atualizar carrinho." });
                    res.json({ message: "Carrinho atualizado com sucesso!" });
                });
        } else {
            db.query("INSERT INTO carrinho (produto_id, quantidade, url_imagem, id_usuario) VALUES (?, ?, ?, ?)",
                [produto_id, quantidade, url_imagem, id_usuario], (err) => {
                    if (err) return res.status(500).json({ error: "Erro ao adicionar ao carrinho." });
                    res.json({ message: "Produto adicionado ao carrinho com sucesso!" });
                });
        }
    });
});

// Carrinho por usuário
app.get('/carrinho/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const sql = `
        SELECT c.id AS carrinho_id, c.quantidade, c.url_imagem, p.nome AS produto_nome, p.id AS produto_id
        FROM carrinho c 
        JOIN produtos p ON c.produto_id = p.id
        WHERE c.id_usuario = ?
    `;
    db.query(sql, [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar carrinho." });
        res.json(results);
    });
});

// Carrinho geral
app.get('/carrinho', (req, res) => {
    const sql = `
        SELECT c.id AS carrinho_id, c.quantidade, c.url_imagem, p.nome AS produto_nome, p.id AS produto_id
        FROM carrinho c
        JOIN produtos p ON c.produto_id = p.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar carrinho." });
        res.json(results);
    });
});

// Remover item do carrinho
app.delete('/carrinho/:id', (req, res) => {
    db.query("DELETE FROM carrinho WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Erro ao remover item do carrinho." });
        res.json({ message: "Item removido do carrinho com sucesso!" });
    });
});

// Atualizar quantidade
app.put('/carrinho/:id', (req, res) => {
    const { quantidade } = req.body;

    if (!quantidade || quantidade < 1) {
        return res.status(400).json({ error: "Quantidade inválida." });
    }

    db.query("UPDATE carrinho SET quantidade = ? WHERE id = ?", [quantidade, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar a quantidade no carrinho." });
        res.json({ message: "Quantidade atualizada com sucesso!" });
    });
});

// Confirmar pedido
app.post('/confirmar-pedido', (req, res) => {
    const { carrinho, id_usuario } = req.body;

    if (!id_usuario || !Array.isArray(carrinho) || carrinho.length === 0) {
        return res.status(400).json({ error: "Dados inválidos para confirmar o pedido." });
    }

    const updatePromises = carrinho.map(item => {
        return new Promise((resolve, reject) => {
            // Verifica a quantidade disponível no banco de dados
            const checkSql = "SELECT quantidade FROM produtos WHERE id = ?";
            db.query(checkSql, [item.produto_id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                const quantidadeDisponivel = results[0]?.quantidade || 0;

                if (quantidadeDisponivel < item.quantidade) {
                    reject(new Error(`Quantidade insuficiente para o produto ${item.produto_id}.`));
                    return;
                }

                // Atualiza a quantidade no banco de dados
                const novaQuantidade = quantidadeDisponivel - item.quantidade;
                const updateSql = "UPDATE produtos SET quantidade = ? WHERE id = ?";
                db.query(updateSql, [novaQuantidade, item.produto_id], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`Produto ${item.produto_id} atualizado: nova quantidade = ${novaQuantidade}`);
                        resolve();
                    }
                });
            });
        });
    });

    Promise.all(updatePromises)
        .then(() => {
            // Remove apenas os itens do carrinho do usuário que foram processados
            db.query("DELETE FROM carrinho WHERE id_usuario = ?", [id_usuario], (err) => {
                if (err) return res.status(500).json({ error: "Erro ao limpar o carrinho." });
                res.json({ message: "Pedido confirmado e estoque atualizado com sucesso!" });
            });
        })
        .catch(err => {
            console.error("Erro ao confirmar pedido:", err.message);
            res.status(400).json({ error: err.message });
        });
});

// Atualizar quantidade de um produto
app.put('/produtos/:id/atualizar-quantidade', (req, res) => {
    const { id } = req.params;
    const { novaQuantidade } = req.body;

    if (novaQuantidade < 0) {
        return res.status(400).json({ error: "A quantidade não pode ser negativa." });
    }

    const sql = "UPDATE produtos SET quantidade = ? WHERE id = ?";
    db.query(sql, [novaQuantidade, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade do produto:', err);
            return res.status(500).json({ error: "Erro ao atualizar quantidade do produto." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Produto não encontrado." });
        }

        res.json({ message: "Quantidade do produto atualizada com sucesso!" });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
