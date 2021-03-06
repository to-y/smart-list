"use strict";

const express = require('express');

module.exports = (app, knex) => {
  const itemMethods = require('../db/methods/items.js')(knex);

  app.get("/", (req, res) => {
    if (!req.user){
      res.redirect('/login');
      return;
    }
    itemMethods.getAll(req.user[0].id, (err, all) => {
      if (err) return console.log(err);
      res.render("index", {
        all: all,
        user_id: req.user[0].id
      });
    });
  });

  app.post("/insertItem", (req, res) => {
    if (!req.user) res.redirect('/login');
    let userId = req.user[0].id
    let types = Object.keys(req.body);
    let object = req.body;
    let obj = {};
    itemMethods.getListId(userId, (err, info) => {
      if (err) return console.log(err);
      info.forEach(function(each) {
        let listType = each.type;
        let listId = each.id;
        obj[listType] = listId;
      });
      types.forEach(function (type) {
        let lowerType = `${type.toLowerCase()}s`;
        let lowerTypeNoS = `${type.toLowerCase()}`;
        let list_ID = obj[lowerType];
        itemMethods.insertItem(list_ID, lowerTypeNoS, object[type])
        .then((id) => {
          res.json(id[0]);
        });
      });
      // return a 200 or something after saving
    });
  });

  app.post("/updateTable", (req, res) => {
    let oldType = req.body.parentName.replace(/col-md-3 /g, '');
    let newType = req.body.targetName.replace(/col-md-3 /g, '');
    let newTypeNoS = req.body.targetName.replace(/col-md-3 /g, '').slice(0, -1);
    let itemName = req.body.itemName.replace(/\s\s*$/, '').replace(/^\s\s*/, '');
    let userId = req.user[0].id;
    let obj = {};

    itemMethods.getListId(userId, (err, info) => {
      if (err) return console.log(err);
      info.forEach(function(each) {
        let listType = each.type;
        let listId = each.id;
        obj[listType] = listId;
      });
      itemMethods.getItemId(obj[oldType], itemName, (err, info) => {
        if (info.length > 0) {
          itemMethods.updateItem(info[0].id, info[0].name, obj[newType], newTypeNoS);
        }
      })
    })
  });

  app.delete("/delete/:id", (req, res) => {
    if (!req.user) res.redirect('/login');
    itemMethods.deleteItem(req.params.id);
    res.sendStatus(200);
  });

}

