'use strict';
module.exports = (knex) => ({


// getItems: function(cb){
//   knex('items')
//   .select('*')
//   .asCallback(cb);
// },

// getListItems: function(list_id, cb){
//   knex('items')
//   .select('*')
//   .where('list_id', '=', list_id)
//   .asCallback(cb);
// },

// getItem: function(item_id, cb) {
//   knex('items')
//   .select('*')
//   .where('id', '=', item_id)
//   .asCallback(cb);
// },

insertItem: function(user_list_id, item_type, item_name, cb) {
  knex('items')
  .insert([{list_id: user_list_id, type: item_type, name: item_name}])
  .asCallback(cb);
},

// deleteItem: function(item_id, cb) {
//   knex('items')
//   .where('id', '=', item_id)
//   .del()
//   .asCallback(cb);
// },

getListId: function(user_id, cb) {
  knex.select('id', 'type')
    .from('lists')
    .where('user_id', '=', user_id).asCallback(cb);
},

getAll: function(user_id, cb) {
  knex.select('*')
    .from('lists')
    .leftJoin('items', 'lists.id', 'items.id')
    .where('lists.user_id', '=', user_id).asCallback(cb);
}

})
