const mongoose = require('mongoose');
const Excel = require('exceljs');
const cron = require('node-cron');

//modelos de schema para Bd
require('../bd/usuarios');
const User = mongoose.model('usuario');
require('../bd/model');
const Model = mongoose.model('modelo');
require('../bd/email');
const Email = mongoose.model('email');

module.exports = {
    servico: 
    cron.schedule(
        //'*/1 * * * *',
        '00 10 * * mon',
        function(){
           let id = Model.usuario;
            //puxar informações da planilha do Bd
            Model.find({id})
            .populate('usuario')
            .then(data =>{
                data.forEach(data =>{
                    //Criação da planilha atualizada
                    let workbookAtualizado = new Excel.Workbook();
                    let sheetAtualizado = workbookAtualizado.addWorksheet('My Sheet');
                    //Cabeçalhos
                    sheetAtualizado.columns = [
                        { header: 'DATA', key: 'data', width: 15 },
                        { header: 'ATIVIDADE', key: 'atividade', width: 32 },
                        { header: 'ÁREA', key: 'area', width: 32 },
                        { header: 'COLABORADOR', key: 'colaborador', width: 32 },
                        { header: 'PROJETO/CLIENTE', key: 'cliente', width: 32 },
                        { header: 'TEMPO', key: 'tempo', width: 15 },
                        { header: 'DATA_CORRETA', key: 'data_correta', width: 15 },
                    ];

                    for (let index = 0; index < data.data.length; index++) {
                        const el = data.data[index];
                        sheetAtualizado.addRow([
                        el.DATA_CORRETA,
                        el.ATIVIDADE,
                        el.ÁREA,
                        el.COLABORADOR,
                        el.CLIENTE,
                        el.TEMPO
                        ]);
                    };
                    sheetAtualizado.getCell('G2').value= { formula: '=TEXT(A2, "dd/mm/aaaa")' };
                    //Geração do arquivo excel atualizado
                    data.data.forEach(arq => {
                        workbookAtualizado.xlsx
                        .writeFile(`./public/atualizados/${arq.COLABORADOR}_TIMESHEET.xlsx`)
                        .then(function() {});
                    });
                });
            }); 
            console.log("rodou"); 
        }
    )
};


    
