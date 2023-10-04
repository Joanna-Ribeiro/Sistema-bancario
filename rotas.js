const express = require('express');
const { listarContas, criarConta, atualizarUsuario, deletarConta, depositarNaConta, realizarSaque, realizarTransferencia, exibirSaldo, exibirExtrato } = require('./controladores/lady-bank');
const { verificarSenha } = require('./intermediarios/verificar-senha');
const { verificandoCPFeEmail, verificarCamposInformados, verificarConta, verificarDepositoConta, verificarSaque, verificarTransferencia, verificarSaldo, verificarExtrato } = require('./intermediarios/verificar-credenciais');
const rotas = express();



rotas.get('/contas', verificarSenha, listarContas);

rotas.post('/contas', verificandoCPFeEmail, verificarCamposInformados, criarConta )

rotas.put('/contas/:numeroConta/usuario', verificarCamposInformados, atualizarUsuario )

rotas.delete('/contas/:numeroConta', verificarConta, deletarConta )

rotas.post('/transacoes/depositar', verificarDepositoConta, depositarNaConta)

rotas.post('/transacoes/sacar', verificarSaque, realizarSaque )

rotas.post('/transacoes/transferir', verificarTransferencia, realizarTransferencia)

rotas.get('/contas/saldo', verificarSaldo, exibirSaldo)

rotas.get('/contas/extrato', verificarExtrato, exibirExtrato )

module.exports = {
    rotas
}