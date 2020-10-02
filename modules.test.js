const db = require('./db')
const {Restaurant} = require('./modules')
const {Menu} = require('./modules')
const {Item} = require('./modules')
const {Table} = require('./modules')
const {Booking} = require('./modules')

describe('Restaurant', () => {
    beforeAll((done) => {
        db.exec('CREATE TABLE IF NOT EXISTS restaurants(id INTEGER PRIMARY KEY, name TEXT, description TEXT, image TEXT); CREATE TABLE IF NOT EXISTS menus(id INTEGER PRIMARY KEY, name TEXT, restaurant_id INTEGER);CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY, name TEXT, price FLOAT, menu_id INTEGER); CREATE TABLE IF NOT EXISTS tables(id INTEGER PRIMARY KEY, restaurant_id INTEGER); CREATE TABLE IF NOT EXISTS bookings(id INTEGER PRIMARY KEY, name TEXT, date TEXT, time TEXT, table_id INTEGER);', done)
     })
    
     test('Can write new restaurants to database' , async () => {
        const downTheHatch = await new Restaurant({name: "Down The Hatch", description: "Vegan Burgers!", image: "url"})

        
        expect(downTheHatch.name).toEqual("Down The Hatch")
        expect(downTheHatch.id).toBe(1)
        
    })

    test('Can read new restaurants from database' , (done) => {
        db.get('SELECT * FROM restaurants WHERE id=?;',1, async function (err,row) {
            
            const downTheHatch = await new Restaurant(row)
            expect(downTheHatch.id).toBe(1)
            expect(downTheHatch.description).toEqual('Vegan Burgers!')
            done()
        })
    })

})

describe('Menu', () => {

    test('Can add new menus to a restaurant' , async () => {
        const mowgli = await new Restaurant({name: "Mowgli", description: "Indian Street Food", image: "url"})

        await mowgli.addMenu({name: "Curries"})
        await mowgli.addMenu({name: "Carbs"})
        await mowgli.addMenu({name: "Drinks"})

        expect(mowgli.menus.length).toBe(3)
        expect(mowgli.menus[2].name).toBe('Drinks')
    })

    test('Can add existing menus to a restaurant' , (done) => {
        db.get('SELECT * FROM restaurants WHERE id=?;',2, async function (err,row) {
            const mowgli = await new Restaurant(row)
            
            expect(mowgli.name).toBe("Mowgli")
            expect(mowgli.menus.length).toBe(3)
            expect(mowgli.menus[2].name).toBe('Drinks')

            done()
        })
    })

})

describe('Item', () => {

    test('Can add new items to a menu' , async () => {
        const crust = await new Restaurant({name: "Crust", description: "Pizza and other food", image: "url"})
        
        await crust.addMenu({name: "Pizza"})
        const pizza = crust.menus[0]

        await pizza.addItem({name: "Margherita", price: 8.50})
        await pizza.addItem({name: "Pepperoni", price: 9.00})

        expect(pizza.items.length).toBe(2)
        expect(pizza.items[0].price).toBe(8.5)
    })

    test('Can add existing items to a menu' , (done) => {
        db.get('SELECT * FROM restaurants WHERE id=?;',3, async function (err,row) {
            const crust = await new Restaurant(row)
            const pizza = crust.menus[0]
        
            
            expect(pizza.name).toBe("Pizza")
            expect(pizza.items.length).toBe(2)
            expect(pizza.items[0].price).toBe(8.5)
            
            done()
        })
    })
   
})

describe('Table', () => {

    test('Can add new tables to a restaurant' , async () => {
        const bakchich = await new Restaurant({name: "Bakchich", description: "Lebanese Street Food", image: "url"})

        await bakchich.addTable()
        await bakchich.addTable()
        await bakchich.addTable()
        await bakchich.addTable()
        await bakchich.addTable()
        await bakchich.addTable()

        expect(bakchich.tables.length).toBe(6)
    })
    
    test('Can add existing tables to a restaurant' , (done) => {
        db.get('SELECT * FROM restaurants WHERE id=?;',4, async function (err,row) {
            const bakchich = await new Restaurant(row)
            
            expect(bakchich.tables.length).toBe(6)
            
            done()
        })
    })

    
})

describe('Booking', () => {

    test('Can add new bookings to a table' , async () => {
        const rosas = await new Restaurant({name: "Rosa's", description: "Thai cafe", image: "url"})
        
        await rosas.addTable()
        const table1 = rosas.tables[0]

        await table1.addBooking({name: 'Martha Simmons', date:"15/11/2020", time:"19:45"})

        expect(table1.bookings.length).toBe(1)
        expect(table1.bookings[0].time).toBe("19:45")
    })

    test('Can add existing bookings to a table' , (done) => {
        db.get('SELECT * FROM restaurants WHERE id=?;',5, async function (err,row) {
            const rosas = await new Restaurant(row)
            const table1 = rosas.tables[0]
        
            expect(table1.bookings.length).toBe(1)
            expect(table1.bookings[0].time).toBe("19:45")
        
            done()
        })
    })
    

     
})