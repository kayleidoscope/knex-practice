const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')
const { expect } = require('chai');

describe(`Items service object`, function () {
    let db;

    let testItems = [
        {
            item_id: 1,
            name: 'banana',
            price: '2.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'
        },
        {
            item_id: 2,
            name: 'cookies',
            price: '4.00',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            checked: false,
            category: 'Snack'
        },
        {
            item_id: 3,
            name: 'beer',
            price: '13.00',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())
    
    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })
        it(`getAllItems() from 'shopping_list' table`, () => {
            // test that ShoppingListService.getAllItems gets data from table
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })
        it(`getById() resolves an article by id from 'shopping_list' table`, () => {
            const thirdId = 3;
            const thirdTestItem = testItems[thirdId - 1];
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        item_id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                        category: thirdTestItem.category
                    })
                })
        })
        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3;
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.item_id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                item_id: 3,
                name: 'cider',
                price: '8.00',
                date_added: new Date('1919-12-22T16:28:32.615Z'),
                checked: false,
                category: 'Snack'
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        item_id: idOfItemToUpdate,
                        ...newItemData
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`insertItem() inserts a new item and resolves it with an id`, () => {
            const newItem = {
                name: 'Totinos Pizza',
                price: '1.00',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Main'
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        item_id: 1,
                        name: 'Totinos Pizza',
                        price: '1.00',
                        date_added: new Date('2020-01-01T00:00:00.000Z'),
                        checked: true,
                        category: 'Main'
                    })
                })
        })
    })
})