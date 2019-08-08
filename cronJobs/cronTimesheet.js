const mongoose = require('mongoose');
const Excel = require('exceljs');
const moment = require('moment');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


//modelos de schema para Bd
require('../bd/usuarios');
const User = mongoose.model('usuario');
require('../bd/model');
const Model = mongoose.model('modelo');
require('../bd/email');
const Email = mongoose.model('email');

module.exports = {
servico:
//código cron uso semanal
cron.schedule(
  //'*/1 * * * *',
    '30 21 * * sun',
    function() {
      //função acertar formato da data
      function acertaData(data) {
        let dataCertapl = data;
        let dateParts = dataCertapl.split('/');
        let dataCertapl2 = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        return dataCertapl2;
      };
      function acertaString(data) {
        let dataCertapl = data;
        let dateParts = dataCertapl.split('-');
        let dataCertapl2 = new String(`${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`);
        return dataCertapl2;
      }
      let id = Model.usuario;
      //puxar informações da planilha do Bd
      Model.find({ id })
        .populate('usuario')
        .then(data => {
          data.forEach(data => {
            let plantonista = data.usuario.plantonista;
            moment.locale('pt-br');
            //Achar a primeira data da planilha
            let date = moment(acertaData(data.data[0].DATA_CORRETA));
            let dow = date.day();
            
            let ultimo = data.data[data.data.length - 1];
            let dateUltimo = moment(acertaData(ultimo.DATA_CORRETA));
            let dowUltimo = dateUltimo.day();
  
            //Criação da planilha
            let workbook = new Excel.Workbook();
            let sheet = workbook.addWorksheet('My Sheet');
            //Cabeçalhos
            sheet.columns = [
              { header: 'DATA', key: 'data', width: 15 },
              { header: 'ATIVIDADE', key: 'atividade', width: 32 },
              { header: 'ÁREA', key: 'area', width: 32 },
              { header: 'COLABORADOR', key: 'colaborador', width: 32 },
              { header: 'PROJETO/CLIENTE', key: 'cliente', width: 32 },
              { header: 'TEMPO', key: 'tempo', width: 15 }
            ];
  
            //Verificar se é plantonista e se a primeira data da planilha é terça feira
            if (plantonista && dow === 2) {
              data.data.forEach(() => {
                //Achar a última data da planilha
            let ultimo = data.data[data.data.length - 1];
            let dateUltimo = moment(acertaData(ultimo.DATA_CORRETA));
            let dowUltimo = dateUltimo.day();
            
                if ((dowUltimo === 1)) {
                  let dataPop = data.data.pop();
                  data.dataUltima.push(dataPop);
                }
              });
              for (let index = 0; index < data.data.length; index++) {
                const el = data.data[index];
                sheet.addRow([
                  el.DATA_CORRETA,
                  el.ATIVIDADE,
                  el.ÁREA,
                  el.COLABORADOR,
                  el.CLIENTE,
                  el.TEMPO
                ]);
              }
              //Geração do arquivo excel
              data.data.forEach(arq => {
                workbook.xlsx
                  .writeFile(`./sheets/${arq.COLABORADOR}_TIMESHEET.xlsx`)
                  .then(function() {});
              });
            } else {
              //Código se não for plantonista
              for (let index = 0; index < data.data.length; index++) {
                const el = data.data[index];
                sheet.addRow([
                  el.DATA_CORRETA,
                  el.ATIVIDADE,
                  el.ÁREA,
                  el.COLABORADOR,
                  el.CLIENTE,
                  el.TEMPO
                ]);
              }
              //Geração do arquivo excel
              data.data.forEach(arq => {
                workbook.xlsx
                  .writeFile(`./sheets/${arq.COLABORADOR}_TIMESHEET.xlsx`)
                  .then(function() {});
              });
            }
  
            //Atualização das datas após geração do arquivo excel
            data.data.forEach(data => {
              moment.locale('pt-br');
              //Se não for plantonista adiciona 7 dias as datas
              if (!plantonista) {
                let dataFinalNormal = moment(acertaData(data.DATA_CORRETA))
                  .add(7, 'days')
                  .format('L');
                let dataFinalNormal2 = dataFinalNormal.toString();
                data.DATA_CORRETA = dataFinalNormal2;
              }
              //Caso seja plantonista
              if(plantonista){
                //Se a primeira data for uma segunda, adiciona 6 dias
                if ((dowUltimo === 1)) {
                  let dataFinalPlantonista = moment(acertaData(data.DATA_CORRETA))
                    .add(6, 'days')
                    .format('L');
                  let dataFinalPlantonista2 = dataFinalPlantonista.toString();
                  data.DATA_CORRETA = dataFinalPlantonista2;
                }else{
                  //Se não for uma segunda adiciona 8 dias
                  let dataFinalPlantonista = moment(acertaData(data.DATA_CORRETA))
                    .add(8, 'days')
                    .format('L');
                  let dataFinalPlantonista2 = dataFinalPlantonista.toString();
                  data.DATA_CORRETA = dataFinalPlantonista2;
                }
              }
              
            });
            
  
            if ((dowUltimo === 1)) {
              data.dataUltima.forEach(ultima => {
                moment.locale('pt-br');
                let finalPlantonista = moment(acertaData(ultima.DATA_CORRETA))
                  .add(6, 'days')
                  .format('L');
                let finalPlantonista2 = finalPlantonista.toString();
                ultima.DATA_CORRETA = finalPlantonista2;
              });
            }else{
              data.dataUltima.forEach(ultima => {
                moment.locale('pt-br');
                let finalPlantonista = moment(acertaData(ultima.DATA_CORRETA))
                  .add(8, 'days')
                  .format('L');
                let finalPlantonista2 = finalPlantonista.toString();
                ultima.DATA_CORRETA = finalPlantonista2;
              });
            }
            let arrayFinal = data.data.concat(data.dataUltima);
            data.dataUltima = [];
            data.data = arrayFinal;
            data.markModified('data');
            data.save();
          });

            //Geração do email
          Email.find({}).then(conteudo => {
            conteudo.forEach(email => {
              let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                  user: 'seu email aqui',
                  pass: 'sua senha aqui'
                },
                tls: {
                  rejectUnauthorized: false
                }
              });
              let testemails = [`${email.destinatario},${email.remetente}`];
              //email de Férias
              if(email.ferias === true){
                let mailOptions = {
                  from: `${email.usuarioNome} <seu email aqui>`,
                  to: testemails,
                  subject: `Timesheet ${email.usuarioNome}`,
                  html: `<p>Prezados estarei de férias entre os dias ${acertaString(email.comeco)} e ${acertaString(email.fim)}</p>
                          <p>Atenciosamente,</p>`,
                };
    
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);
                  console.log(
                    'Preview URL: %s',
                    nodemailer.getTestMessageUrl(info)
                  );
                });
              }else{
                let mailOptions = {
                  from: `${email.usuarioNome} <seu email aqui>`,
                  to: testemails,
                  subject: `Timesheet ${email.usuarioNome}`,
                  html: email.email,
                  attachments: [
                    {
                      path: `./sheets/${email.usuarioNome.toUpperCase()}_TIMESHEET.xlsx`
                    }
                  ]
                };
    
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);
                  console.log(
                    'Preview URL: %s',
                    nodemailer.getTestMessageUrl(info)
                  );
                });
              }
              
            });
          });
          
        });
        

      console.log('rodando');
    },
    {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    }
  )

}