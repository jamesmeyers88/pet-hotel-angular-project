const express = require('express');
const router = express.Router();

const pool = require('../modules/pool')

router.post('/', (req, res) => {
    console.log('in POST on router', req.body);
    const newPet = req.body;
    const queryText = `INSERT INTO pet ("owner_id", "name", "breed", "color", "is_checked_in") 
                       VALUES ($1, $2, $3, $4, $5);`;
    pool.query(queryText, [newPet.owner_id, newPet.name, newPet.breed, newPet.color, newPet.is_checked_in])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log('ERROR ADDING pet - POST router -', error);
            res.sendStatus(500);
        });
});

router.get('/', function(req, res){
    console.log('in petHotelGET');

    const queryText = `SELECT owner.first_name as owner, owner.id, pet.name as pet, pet.breed, pet.color, is_checked_in FROM owner
    LEFT JOIN pet ON owner.id = pet.owner_id;`;

    pool.query(queryText)
    .then((result) => {
        res.send(result.rows);
    }).catch(function(err){
        console.log('Error in GET search', err); 
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log('In DELETE router');
    const queryText = 'DELETE FROM pet WHERE id=$1';
    pool.query(queryText, [id])
      .then((results)=>{
        console.log('Successfully deleted');
        res.sendStatus(200);
      }).catch((err)=>{
        console.log('Error', err);
        res.sendStatus(500);
      })
  });

module.exports = router;

