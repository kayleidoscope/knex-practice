require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

function findItemsThatContain(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

// findItemsThatContain('ham')

function paginateItems(page) {
    const itemsPerPage = 6;
    const offset = itemsPerPage * (page - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

// paginateItems(2)

function itemsAddedAfter(daysAgo) {
    knexInstance
        .select('*')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .from('shopping_list')
        .then(result => {
            console.log(result)
        })
}

// itemsAddedAfter(3)


function totalCostOfItems() {
    knexInstance
        .select('category')
        .sum('price AS total_price')
        .from('shopping_list')
        .groupBy('category')
        .orderBy([
            {column: 'category', order: 'ASC'}
        ])
        .then(result => {
            console.log(result)
        })
}

totalCostOfItems()