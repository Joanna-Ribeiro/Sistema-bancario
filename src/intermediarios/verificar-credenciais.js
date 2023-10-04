const { banco } = require ('../bancodedados');

function verificandoCPFeEmail(req, res, next) {
  
        const { usuario, cpf, email } = req.body 

    for (let i = 0; i < banco.length; i++) {
       if(banco[i].usuario.cpf === req.body.cpf || banco[i].usuario.email === req.body.email) {
        return res.status(403).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })

       }
       }

    next();

}

function verificarCamposInformados(req, res, next) {
 
const { nome, cpf, data_nascimento, telefone, email, senha }  = req.body 

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha ) {
        return res.status(404).json({ "mensagem": "Campo obrigatório" })
    }
   
    next();
     
}

function verificarConta(req,res,next) {

    const { numeroConta } = req.params

    const conta = banco.find(item => item.numero === numeroConta);

    if (!conta) {
        return res.status(400).json({ "mensagem": "Número de conta inválido" });
    }

    next();
}

function verificarDepositoConta(req,res,next) {
  
    const { numero_conta, valor } = req.body
    
    if(!numero_conta && !valor){
        return(403).json({ "mensagem": "valor e numero da conta são campos obrigatórios"})
    }

    if(valor <= 0 ){
        return res.status(403).json({ "mensagem": "Não é permitido depósitos com valores negativos ou zerados" });
    }
    
    
    next();

}

function verificarSaque(req, res, next) {
    
    const { numero_conta, valor, senha } = req.body
    const contaExistente = banco.find(item => item.numero === numero_conta); 
    const senhaValida = banco.find(it => it.usuario.senha === senha);


    if (!contaExistente){ 
        return res.status(400).json({ "mensagem": "Conta inexistente"});
    }

    if(!numero_conta || !valor || !senha){
        return res.status(403).json({ "mensagem": "Numero da conta, saque e senha são campos obrigatórios"})
    }

    if (!senhaValida) {
        return res.status(401).json({ "mensagem": "Senha inválida para conta informada!"}); 
 
    }

    if (contaExistente && contaExistente.saldo < valor) {
        return res.status(403).json({ "mensagem": "Saldo insuficiente para o saque solicitado" });

    }

    next();
}

function verificarTransferencia(req, res, next) {

    const { numero_conta_origem, numero_conta_destino, senha, valor} = req.body
    const contaOrigemExistente = banco.find(item => item.numero === numero_conta_origem); 
    const senhaValida = banco.find(it => it.usuario.senha === senha);

    if(!numero_conta_origem || !senha || !valor){
        return res.status(400).json({ "mensagem": "Preencha os Campos Obrigatórios!"})
    }

    if(!contaOrigemExistente){
        return res.status(404).json({ "mensagem": "Conta de Origem inexistente!" });

    }

    if(!numero_conta_destino){
        return res.status(404).json({ "mensagem": "Conta de Destino inexistente!" });

    }

    if (!senhaValida) {
        return res.status(403).json({ "mensagem": "Senha inválida para conta de origem informada!"}); 
 
    }

    next();
}

function verificarSaldo(req,res,next) {

    const { numero_conta, senha } = req.query
    const senhaValida = banco.find(it => it.usuario.senha === senha);

    if (!numero_conta || !senha){
        return res.status(400).json({ "mensagem": "Numero da conta e senha são Campos Obrigatórios!"})
    }

    if (!senhaValida) {
        return res.status(403).json({ "mensagem": "Senha inválida!"}); 
 
    }

    next();

}

function verificarExtrato(req, res, next) {
    
    const { numero_conta, senha } = req.query
    const senhaValida = banco.find(it => it.usuario.senha === senha);

    if (!numero_conta || !senha){
        return res.status(400).json({ "mensagem": "Numero da conta e senha são Campos Obrigatórios!"})
    }

    if (!senhaValida) {
        return res.status(403).json({ "mensagem": "Senha inválida!"}); 
 
    }

    next();
}

module.exports = {
    verificandoCPFeEmail,
    verificarCamposInformados, 
    verificarConta,
    verificarDepositoConta,
    verificarSaque,
    verificarTransferencia,
    verificarSaldo,
    verificarExtrato
}