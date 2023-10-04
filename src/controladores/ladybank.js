const { banco, contas, depositos, saques, transferencias, usuario } = require ('../bancodedados');
const { verificarSenha } = require('../intermediarios/verificar-senha')
const { rotas } = require('../rotas')

let idUnico = 3;

function listarContas(req, res) {
    const { senha_banco } = req.query
    
    if (senha_banco){ 
        return verificarSenha
}
}
    

function criarConta(req, res) {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const novaConta = {

    id: idUnico.toString(),
    saldoInicial: 0,
        usuario : {

        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,

        }
        
    }
    
    contas.push(novaConta)
    idUnico++
    console.log(novaConta);
    return res.status(201).send()
    
}

function atualizarUsuario(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { numeroConta } = req.params

    
    const conta = banco.find(item => item.numero === numeroConta);

    
    if(conta.usuario.cpf === cpf){
        return res.status(403).json({ "mensagem": "O CPF informado já existe cadastrado!"})
    }
    
    if(conta.usuario.email === email){
        return res.status(403).json({ "mensagem": "O Email informado já existe cadastrado!"})
    }

    

    if (nome || cpf || data_nascimento || telefone || email || senha ) {
    const atualizarDados = {

        usuario : {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha

        }
    }

    contas.push(atualizarDados)
    console.log(atualizarDados);
    return res.status(204).send()
}
}

function deletarConta(req,res) {
    const numeroConta = req.params.numeroConta;

    const indiceConta = banco.findIndex(conta => conta.numero === numeroConta);

    if (indiceConta === -1) {
        return res.status(404).json({ "mensagem": "Conta não encontrada" });
    }

    const conta = banco[indiceConta]; 

    if (conta.saldo !== 0){
        return res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }

    banco.splice(indiceConta, 1); 
    console.log(banco);

    return res.status(204).send();
}

function depositarNaConta(req, res) {

    const { numero_conta, valor } = req.body
    const conta = banco.find(item => item.numero === numero_conta); 
    
    if (conta) { 
        conta.saldo += valor 

        const registroDeposito  = {
            data: new Date().toISOString(),
            numero_conta: numero_conta,
            valor: valor
        }

        depositos.push(registroDeposito)
        console.log(registroDeposito);
        return res.status(201).send()

    } 

        if(numero_conta !== banco.numero) {
        return res.status(403).json({ "mensagem": "Não existe conta com o número especificado"})
        }
       
}

function realizarSaque(req, res) {

    const { numero_conta, valor } = req.body

    for (let i = 0; i < banco.length; i++) {

        if (banco[i].saldo > valor){
            banco[i].saldo -= valor

        const registroSaque = {

            data: new Date().toISOString(),
            numero_conta: numero_conta,
            valor: banco[i].saldo

        }

        saques.push(registroSaque)
        console.log(registroSaque);
        return res.status(200).send()
    }

    }

}

function realizarTransferencia(req, res) {
    
    const { numero_conta_origem, numero_conta_destino} = req.body
    let { valor } = req.body

    const contaOrigemExistente = banco.find(item => item.numero === numero_conta_origem);
    const contaDestinoExistente = banco.find(item => item.numero === numero_conta_destino) 

    if(contaOrigemExistente && contaOrigemExistente.saldo >= valor) {
        valor -= contaOrigemExistente.saldo;
        valor += contaDestinoExistente.saldo;
        let valorFinal = parseFloat(valor)

        const registroTransferencia = {

            data: new Date().toISOString(),
            numero_conta_origem: numero_conta_origem,
            numero_conta_destino: numero_conta_destino,
            valor: valorFinal

        }

        transferencias.push(registroTransferencia)
        console.log(registroTransferencia)
        return res.status(200).send()

    }

    return res.status(400).json({ "mensagem": "Saldo Insuficiente!" })
}

function exibirSaldo(req, res) {

    const { numero_conta, senha } = req.query
    const contaExistente = banco.find(item => item.numero === numero_conta);

    if(contaExistente && senha){
        return res.status(200).json({ "saldo": contaExistente.saldo })
    }

    return res.status(404).json({ "mensagem": "Conta bancária não encontrada!" })
}

function exibirExtrato(req, res) {

    const { numero_conta, senha } = req.query
    const contaExistente = banco.find(item => item.numero === numero_conta);
    const transferênciasEnviadas = transferencias.filter(item => item.numero_conta_origem === numero_conta)
    const transferenciasRecebidas = transferencias.filter(item => item.numero_conta_destino === numero_conta)

    if(contaExistente){
        return res.status(200).json({ "depositos": depositos, 
         "saques": saques,
         transferênciasEnviadas,
         transferenciasRecebidas})
    }

    return res.status(404).json({ "mensagem": "Conta bancária não encontrada!" })
    
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    deletarConta,
    depositarNaConta,
    realizarSaque,
    realizarTransferencia,
    exibirSaldo,
    exibirExtrato
}