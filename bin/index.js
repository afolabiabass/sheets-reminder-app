#!/usr/bin/env node
"use strict";

const dotenv = require("dotenv");
const yargs = require("yargs");
const Sheets = require("../src/Sheets");
const Mail = require("../src/Mail");

dotenv.config();

let ReminderMail = new Mail()
ReminderMail.from = process.env.MAIL_FROM ;
for(let to of process.env.MAIL_TO.split(',')) {
  ReminderMail.to = to;
}
ReminderMail.subject = 'Your Automated Reminder to Eat and Todos';
ReminderMail.template = 'templates/email.twig';

const options = yargs
  .usage("Usage: -i <sheet>")
  .option("i", { alias: "sheet", describe: "Google sheet source of truth", type: "string", demandOption: true })
  .argv;

const GoogleSheet = new Sheets(options.sheet);

let foodSheet = null
let todosSheet = null
GoogleSheet.authenticate().then(() => {
  foodSheet = GoogleSheet.getSheet('Food')
  todosSheet = GoogleSheet.getSheet('Todos')
  GoogleSheet.getRows(foodSheet).then((data) => {
    const d = new Date();
    const n = d.getDay();

    GoogleSheet.getRows(todosSheet).then((todoData) => {
      const todos = [];
      for(let row of todoData) {
        todos.push(row.Todo)
      }
      ReminderMail = ReminderMail.with('sheet', options.sheet)
        .with('breakfast', options.sheet)
        .with('breakfast', data[n].Breakfast)
        .with('lunch', data[n].Lunch)
        .with('dinner', data[n].Dinner)
        .with('todos', todos)
        .send();
    })
  })
}).catch((e) => {
  throw e;
});






