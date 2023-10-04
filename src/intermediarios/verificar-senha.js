const { banco } = require ('../bancodedados');

const verificarSenha = async (req, res, next) => {
    const { senha_banco } = req.query;

    for (i = 0; i < banco.length; i++) {
        if (banco[i].usuario.senha === req.query.senha_banco) {
            return res.status(200).json({ banco });
        } else {
            return res.status(401).json({ "mensagem": `A senha do banco informada é inválida!`});
        }
    }

    if (banco.length === 0) {
    return res.status(404).json({ banco });
    }

    next();
}

module.exports = {
    verificarSenha
}
